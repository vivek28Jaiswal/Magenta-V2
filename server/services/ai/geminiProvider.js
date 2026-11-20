import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../../utils/logger.js';

export const callGeminiStructured = async ({ systemPrompt, userPrompt }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Support gemini-1.5-flash or gemini-2.0-flash
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
    systemInstruction: systemPrompt,
  });

  logger.info('Calling Google Gemini API...');
  const result = await model.generateContent(userPrompt);
  const responseText = result.response.text();
  return JSON.parse(responseText);
};
