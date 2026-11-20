import axios from 'axios';
import { logger } from '../../utils/logger.js';

/**
 * Extracts job description and metadata from an external job URL.
 * Handles JSON-LD JobPosting schemas, SSR job boards (Lever, Greenhouse, etc.),
 * and gracefully identifies client-side protected portals (Naukri, LinkedIn).
 */
export const extractJobFromUrl = async (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('A valid URL is required.');
  }

  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  const parsedUrl = new URL(targetUrl);
  const hostname = parsedUrl.hostname.toLowerCase();

  // 1. Identify common protected / SPA job portals that block server-side scrapers
  const isNaukri = hostname.includes('naukri.com');
  const isLinkedIn = hostname.includes('linkedin.com');
  const isInternshala = hostname.includes('internshala.com');
  const isIndeed = hostname.includes('indeed.com');

  logger.info(`Attempting to extract job details from: ${targetUrl} (Domain: ${hostname})`);

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    const html = response.data;
    if (typeof html !== 'string' || html.length < 200) {
      throw new Error('The target page did not return readable HTML content.');
    }

    // 2. Check for JSON-LD JobPosting schema first (standard SEO markup on Greenhouse, Lever, etc.)
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        const item = Array.isArray(parsed) ? parsed.find(x => x['@type'] === 'JobPosting') : parsed;
        if (item && (item['@type'] === 'JobPosting' || item.title)) {
          const title = item.title || item.name || '';
          const company = item.hiringOrganization?.name || '';
          const location = item.jobLocation?.address?.addressLocality || 
                           item.jobLocation?.address?.addressRegion || 
                           (typeof item.jobLocation === 'string' ? item.jobLocation : 'Remote');
          let description = (item.description || '').replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ').trim();

          if (description.length > 80) {
            return {
              success: true,
              title: title.trim(),
              company: company.trim(),
              location: location.trim(),
              description: description,
              originalUrl: targetUrl,
            };
          }
        }
      } catch (e) {
        // Continue searching
      }
    }

    // 3. Extract OpenGraph and Meta tags
    const getMeta = (prop) => {
      const re = new RegExp(`<meta[^>]*(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i');
      const m = html.match(re);
      return m ? m[1].trim() : '';
    };

    const ogTitle = getMeta('og:title') || getMeta('twitter:title');
    const ogDesc = getMeta('og:description') || getMeta('description');
    const ogSiteName = getMeta('og:site_name');

    // Title from <title> tag
    const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);
    const pageTitle = titleTagMatch ? titleTagMatch[1].trim() : '';

    // 4. Strip scripts, styles, and navigational elements
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    const textLines = cleanText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    // Check if site is an empty shell / login wall (like Naukri returning generic page title)
    const isGenericNaukriShell = isNaukri && (
      pageTitle.includes('Recruitment - Job Search') || 
      textLines.length < 30 ||
      !textLines.some(l => /responsibilities|qualifications|experience|skills|about the role/i.test(l))
    );

    const isLinkedInLoginWall = isLinkedIn && (
      html.includes('authwall') || 
      html.includes('sign-in') || 
      pageTitle.includes('Sign In')
    );

    if (isGenericNaukriShell || isLinkedInLoginWall) {
      const portal = isNaukri ? 'Naukri.com' : isLinkedIn ? 'LinkedIn' : 'This job portal';
      return {
        success: false,
        isProtected: true,
        portalName: portal,
        message: `${portal} requires a logged-in user session to display full job details. Please copy the job description directly from ${portal} and paste it into the "Paste JD" box.`,
      };
    }

    // 5. Look for main content block
    let substantiveLines = textLines.filter(l => l.length > 20 && !/cookies|copyright|terms|privacy policy/i.test(l));
    let extractedDescription = substantiveLines.slice(0, 50).join('\n\n');

    if (extractedDescription.length < 80 && ogDesc && ogDesc.length > 50) {
      extractedDescription = ogDesc;
    }

    if (extractedDescription.length < 60) {
      return {
        success: false,
        isProtected: true,
        portalName: hostname,
        message: `Could not automatically extract the full job description from ${hostname}. Please copy and paste the text directly into the "Paste JD" box.`,
      };
    }

    // Infer Title & Company
    let inferredTitle = ogTitle || pageTitle.split(/[-–|]/)[0].trim() || 'Software Engineer';
    let inferredCompany = ogSiteName || (pageTitle.split(/[-–|]/)[1] || '').trim() || 'Company';

    return {
      success: true,
      title: inferredTitle,
      company: inferredCompany,
      location: 'Unspecified',
      description: extractedDescription,
      originalUrl: targetUrl,
    };
  } catch (error) {
    logger.warn(`Scraper failed for URL ${targetUrl}: ${error.message}`);
    const portal = isNaukri ? 'Naukri.com' : isLinkedIn ? 'LinkedIn' : hostname;
    return {
      success: false,
      isProtected: true,
      portalName: portal,
      message: `${portal} blocks automated readers. Please copy the job description directly from the website and paste it into the "Paste JD" box.`,
    };
  }
};
