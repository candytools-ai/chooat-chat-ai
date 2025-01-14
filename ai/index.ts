import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

const openrouter = createOpenAI({
  name: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  fetch: async (url, options) => {
    return await fetch(url, options);
  }
});

const google = createGoogleGenerativeAI({
  // custom settings
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const customModel = (apiIdentifier: string) => {
  if (apiIdentifier.includes("gemini")) {
    return google(apiIdentifier);
  } else {
    return openrouter(apiIdentifier);
  }
};
