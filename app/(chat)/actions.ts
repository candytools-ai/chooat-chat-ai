'use server';

import { generateText, Message } from 'ai';
import to from "await-to-js";
import { cookies } from 'next/headers';

import { customModel } from '@/ai';

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}

// 为对话生成简短标题
export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message | any;
}) {
  const [error, result] = await to(generateText({
    model: customModel('openai/gpt-4o-mini'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  }));

  if (error) {
    console.error("generateText error:", error.message)
    return "An error occurred while generate text"
  }
  
  return result.text;
}
