import { analyzeJobDescriptionAI } from '../ai/aiProvider.js';

export const analyzeJobDescription = async (jdText, details = {}) => {
  return await analyzeJobDescriptionAI(jdText, details);
};
