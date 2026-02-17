import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import { customProvider } from "ai";

const glm = createOpenAI({
  baseURL: process.env.GLM_BASE_URL ?? "https://api.z.ai/api/coding/paas/v4",
  apiKey: process.env.GLM_API_KEY!,
  fetch: async (url, init) => {
    if (typeof init?.body === "string") {
      const body = JSON.parse(init.body);
      // Z.AI only supports json_object, not json_schema
      if (body.response_format?.type === "json_schema") {
        body.response_format = { type: "json_object" };
        init = { ...init, body: JSON.stringify(body) };
      }
    }
    return fetch(url, init);
  },
});

export const baseProviderOptions = {};

export const myProvider = customProvider({
  languageModels: {
    base: glm.chat(process.env.GLM_BASE_MODEL_ID ?? "glm-4.6v"),
    "theme-generation": glm.chat(process.env.GLM_THEME_MODEL_ID ?? "glm-4.7"),
    "prompt-enhancement": glm.chat(process.env.GLM_PROMPT_MODEL_ID ?? "glm-4.7-flash"),
  },
});
