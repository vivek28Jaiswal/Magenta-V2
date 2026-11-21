import fs from 'fs';
import path from 'path';
import os from 'os';
import zlib from 'zlib';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { logger } from '../../utils/logger.js';

// Decodes PDF octal/escaped string literals like \072, \100, \056
const decodePdfString = (str) => {
  return str
    .replace(/\\([0-7]{1,3})/g, (match, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\r/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\b/g, '')
    .replace(/\\f/g, '')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/[\u0013\u0014]/g, '—');
};

// Extracts accessibility structure text (/ActualText and /Alt) widely used by Figma, Canva, and modern design tools
const extractActualTextFromPdf = (buffer) => {
  try {
    const raw = buffer.toString('binary');
    const actualTextRegex = /\/(ActualText|Alt)\s*\(([\s\S]*?)\)/g;
    let match;
    const pieces = [];

    while ((match = actualTextRegex.exec(raw)) !== null) {
      const decoded = decodePdfString(match[2]).trim();
      if (decoded && decoded.length > 0) {
        pieces.push(decoded);
      }
    }

    if (pieces.length > 0) {
      logger.info(`Extracted ${pieces.length} /ActualText structure elements from PDF`);
      return pieces.join('\n');
    }
    return '';
  } catch (err) {
    logger.warn('Failed to extract ActualText from PDF:', err.message);
    return '';
  }
};

// Fallback stream extractor for compressed PDF text operators
const extractTextFromRawPdfStreams = (buffer) => {
  try {
    const raw = buffer.toString('binary');
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;
    let combinedText = '';

    while ((match = streamRegex.exec(raw)) !== null) {
      const streamData = Buffer.from(match[1], 'binary');
      let decompressed = '';
      try {
        decompressed = zlib.inflateSync(streamData).toString('utf-8');
      } catch (e) {
        try {
          decompressed = zlib.inflateRawSync(streamData).toString('utf-8');
        } catch (e2) {
          decompressed = streamData.toString('utf-8');
        }
      }

      // Extract text inside Tj and TJ operators
      const tjMatches = decompressed.matchAll(/\((.*?)\)\s*Tj/g);
      for (const m of tjMatches) {
        if (m[1]) combinedText += decodePdfString(m[1]) + ' ';
      }

      const tjArrayMatches = decompressed.matchAll(/\[(.*?)\]\s*TJ/g);
      for (const m of tjArrayMatches) {
        const innerStrings = m[1].matchAll(/\((.*?)\)/g);
        for (const is of innerStrings) {
          if (is[1]) combinedText += decodePdfString(is[1]) + ' ';
        }
      }
    }

    return combinedText.replace(/\s+/g, ' ').trim();
  } catch (err) {
    return '';
  }
};

// Extracts embedded JPEG scans from a PDF buffer
const extractEmbeddedJpegsFromPdf = (buffer) => {
  const jpegs = [];
  const startMarker = Buffer.from([0xff, 0xd8, 0xff]);
  const endMarker = Buffer.from([0xff, 0xd9]);
  let offset = 0;

  while (offset < buffer.length) {
    const start = buffer.indexOf(startMarker, offset);
    if (start === -1) break;
    const end = buffer.indexOf(endMarker, start + 3);
    if (end === -1) break;
    const jpegBuffer = buffer.slice(start, end + 2);

    // Only collect substantial images likely to be page scans (> 5KB)
    if (jpegBuffer.length >= 5000) {
      jpegs.push(jpegBuffer);
    }
    offset = end + 2;
  }
  return jpegs;
};

// Runs OCR on an image file path or image buffer using Tesseract.js
export const performOcr = async (imageInput, label = 'document') => {
  logger.info(`Starting Tesseract OCR engine on ${label}...`);
  let worker = null;
  try {
    const tesseractCache = path.join(os.tmpdir(), 'tesseract-cache');
    worker = await Tesseract.createWorker('eng', 1, {
      cachePath: tesseractCache,
    });
    const ret = await worker.recognize(imageInput);
    const text = (ret.data.text || '').trim();
    const confidence = Math.round(ret.data.confidence || 0);
    logger.info(`OCR finished for ${label}: extracted ${text.length} characters (confidence: ${confidence}%)`);
    return {
      text,
      confidence,
      ocrApplied: true,
    };
  } catch (err) {
    logger.error(`OCR processing failed for ${label}: ${err.message}`);
    throw new Error(`OCR processing failed: ${err.message}`);
  } finally {
    if (worker) {
      try { await worker.terminate(); } catch (e) {}
    }
  }
};

// Magic bytes file type detector
export const detectFileType = (buffer, filename) => {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  
  if (buffer.length >= 4) {
    // PDF: %PDF- (0x25, 0x50, 0x44, 0x46)
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      return 'pdf';
    }
    // PNG: \x89PNG (0x89, 0x50, 0x4E, 0x47)
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return 'png';
    }
    // JPEG: 0xFF, 0xD8, 0xFF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'jpeg';
    }
    // WEBP: RIFF....WEBP
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      return 'webp';
    }
    // DOCX / ZIP: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    if (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
      return 'docx';
    }
    // DOC / OLE2: 0xD0, 0xCF, 0x11, 0xE0
    if (buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0) {
      return 'doc';
    }
  }

  if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'].includes(ext)) {
    return ext;
  }
  return ext || 'pdf';
};

export const extractTextFromFile = async (filePath, originalName) => {
  logger.info(`Extracting text from: ${originalName}`);

  if (!fs.existsSync(filePath)) {
    throw new Error('Resume file not found on server.');
  }

  const fileBuffer = fs.readFileSync(filePath);
  const detectedType = detectFileType(fileBuffer, originalName);
  logger.info(`Detected file format for ${originalName}: ${detectedType}`);

  let text = '';
  let ocrApplied = false;
  let ocrConfidence = null;
  let pageCount = 1;

  const isImageFormat = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff'].includes(detectedType);

  if (isImageFormat) {
    // ------------------------------------------------------------------------
    // IMAGE FORMAT: Run OCR directly on image
    // ------------------------------------------------------------------------
    logger.info(`Applying OCR on native image resume: ${originalName}`);
    const ocrResult = await performOcr(filePath, originalName);
    text = ocrResult.text;
    ocrApplied = true;
    ocrConfidence = ocrResult.confidence;
    pageCount = 1;

    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length < 20) {
      throw new Error(
        'Could not detect readable text in the uploaded image. Please ensure the resume image is clear, well-lit, uncropped, or switch to the "Paste Resume Text" tab.'
      );
    }
  } else if (detectedType === 'pdf') {
    // ------------------------------------------------------------------------
    // PDF FORMAT: Multi-layer extraction + Scanned OCR Fallback
    // ------------------------------------------------------------------------
    
    // 1. First, check if the PDF contains /ActualText structure tree (Figma, Canva, InDesign)
    const actualTextContent = extractActualTextFromPdf(fileBuffer);
    if (actualTextContent && actualTextContent.replace(/\s+/g, ' ').trim().length > 60) {
      logger.info('Successfully extracted rich text using PDF Accessibility /ActualText structure tree (Figma/Vector export).');
      text = actualTextContent;
    } else {
      // 2. Standard pdf-parse extraction
      try {
        const data = await pdfParse(fileBuffer);
        text = data.text || '';
        if (data.numpages) {
          pageCount = data.numpages;
        }
      } catch (err) {
        logger.warn(`pdf-parse failed on ${originalName} (${err.message})`);
      }

      // 3. Fallback raw PDF stream text extraction
      const cleaned = text.replace(/\s+/g, ' ').trim();
      if (cleaned.length < 25) {
        logger.info('Attempting fallback raw PDF stream text extraction...');
        const streamText = extractTextFromRawPdfStreams(fileBuffer);
        if (streamText.length > cleaned.length) {
          text = streamText;
        }
      }
    }

    // 4. Scanned PDF Detection & Embedded Image OCR
    const finalCleaned = text.replace(/\s+/g, ' ').trim();
    if (finalCleaned.length < 30) {
      logger.info(`PDF has no selectable text (${finalCleaned.length} chars). Inspecting for scanned page images to apply OCR...`);
      const embeddedJpegs = extractEmbeddedJpegsFromPdf(fileBuffer);

      if (embeddedJpegs.length > 0) {
        logger.info(`Found ${embeddedJpegs.length} embedded page scans in PDF. Running page-by-page OCR...`);
        const pageTexts = [];
        let totalConfidence = 0;

        for (let i = 0; i < embeddedJpegs.length; i++) {
          const pageImage = embeddedJpegs[i];
          const pageOcr = await performOcr(pageImage, `PDF Page ${i + 1}`);
          if (pageOcr.text.trim()) {
            pageTexts.push(`--- Page ${i + 1} ---\n` + pageOcr.text.trim());
            totalConfidence += pageOcr.confidence;
          }
        }

        if (pageTexts.length > 0) {
          text = pageTexts.join('\n\n');
          ocrApplied = true;
          ocrConfidence = Math.round(totalConfidence / pageTexts.length);
          pageCount = pageTexts.length;
          logger.info(`Successfully completed OCR on scanned PDF: extracted ${text.length} characters across ${pageCount} pages (avg confidence: ${ocrConfidence}%)`);
        }
      }
    }

    const postOcrCleaned = text.replace(/\s+/g, ' ').trim();
    if (postOcrCleaned.length < 20) {
      throw new Error(
        'The uploaded PDF appears to be a blank or very low-resolution scan where text could not be recognized. Please upload a PDF with selectable text, a clearer document, or switch to the "Paste Resume Text" tab.'
      );
    }
  } else if (detectedType === 'docx') {
    // ------------------------------------------------------------------------
    // DOCX FORMAT: Mammoth extraction
    // ------------------------------------------------------------------------
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value || '';
    } catch (err) {
      logger.error('Failed to parse DOCX file:', err.message);
      throw new Error('Could not read DOCX document. It might be corrupted.');
    }

    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length < 20) {
      throw new Error('The uploaded DOCX file does not contain readable text. Try pasting your resume text directly.');
    }
  } else if (detectedType === 'doc') {
    // ------------------------------------------------------------------------
    // DOC FORMAT: Legacy binary stream extraction
    // ------------------------------------------------------------------------
    text = fileBuffer.toString('utf-8').replace(/[^\x20-\x7E\t\n\r]/g, ' ');
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length < 20) {
      throw new Error('Could not extract sufficient text from legacy .doc file. Please convert to PDF/DOCX or use Paste Resume Text.');
    }
  } else {
    throw new Error(`Unsupported file type: ${detectedType}. Please upload a PDF, DOCX, DOC, JPG, or PNG.`);
  }

  const normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\u0000/g, '')
    .replace(/[\u0013\u0014]/g, '—')
    .trim();

  const extractionQuality = ocrApplied
    ? ocrConfidence >= 75
      ? 'high'
      : ocrConfidence >= 50
      ? 'adequate'
      : 'partial'
    : 'high';

  logger.info(`Extraction complete: ${normalizedText.length} characters, type: ${detectedType}, OCR: ${ocrApplied}, quality: ${extractionQuality}`);

  return {
    text: normalizedText,
    fileType: detectedType,
    fileSize: fileBuffer.length,
    pageCount,
    ocrApplied,
    ocrConfidence,
    extractionQuality,
  };
};
