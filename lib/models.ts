import { groq } from "@ai-sdk/groq";
import { openai, createOpenAI } from "@ai-sdk/openai";
import { customProvider } from "ai";

const fireworks = createOpenAI({
  apiKey: process.env.HF_TOKEN,
  baseURL: "https://router.huggingface.co/fireworks-ai/inference/v1",
});

export const statements = customProvider({
  languageModels: {
    "statements-default": groq("openai/gpt-oss-120b"),
    "statements-qwen": groq("qwen-qwq-32b"),
    "statements-openai": openai("gpt-5-mini-2025-08-07"),
    "statements-r1": fireworks("accounts/fireworks/models/deepseek-r1-0528"),
  },
});

export type Model = "statements-default" | "statements-qwen" | "statements-openai" | "statements-r1";

export const modelOptions: { id: Model; name: string }[] = [
  { id: "statements-openai", name: "GPT-5 Mini" },
  { id: "statements-default", name: "GPT-OSS 120B (Groq)" },
  { id: "statements-qwen", name: "Qwen 3 32B" },
  { id: "statements-r1", name: "DeepSeek R1" },
];
