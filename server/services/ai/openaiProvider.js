import OpenAI from 'openai';
import { logger } from '../../utils/logger.js';

export const callOpenAIStructured = async ({ systemPrompt, userPrompt }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const openai = new OpenAI({ apiKey });
  logger.info('Calling OpenAI API...');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.1,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};
