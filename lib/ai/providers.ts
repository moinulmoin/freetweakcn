import "server-only";

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { customProvider } from "ai";

const glm = createOpenAICompatible({
  name: "glm",
  baseURL: process.env.GLM_BASE_URL!,
  apiKey: process.env.GLM_API_KEY!,
});

export const baseProviderOptions = {};

export const myProvider = customProvider({
  languageModels: {
    base: glm.chatModel(process.env.GLM_BASE_MODEL_ID ?? "glm-4.6v"),
    "theme-generation": glm.chatModel(process.env.GLM_THEME_MODEL_ID ?? "glm-4.7"),
    "prompt-enhancement": glm.chatModel(process.env.GLM_PROMPT_MODEL_ID ?? "glm-4.7-flash"),
  },
});
