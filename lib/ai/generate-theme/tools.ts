import { themeStylesOutputSchema } from "@/lib/ai/generate-theme";
import { baseProviderOptions, myProvider } from "@/lib/ai/providers";
import { defaultThemeState } from "@/config/theme";
import { AdditionalAIContext } from "@/types/ai";
import { generateText, Output, streamText, tool } from "ai";
import z from "zod";

const themeTokenKeys = Object.keys(defaultThemeState.styles.light).filter(
  (key) => key !== "spacing"
);

const THEME_OBJECT_SYSTEM = [
  "Return only a JSON object with exactly this shape:",
  '{"light": {...}, "dark": {...}}',
  "Both light and dark must include all required keys.",
  `Required keys: ${themeTokenKeys.join(", ")}`,
  "Every value must be a string.",
  "Do not include any keys outside light and dark.",
  "Do not include names, descriptions, nested color groups, or component objects.",
].join("\n");

type ThemeObject = z.infer<typeof themeStylesOutputSchema>;

export const THEME_GENERATION_TOOLS = {
  generateTheme: tool({
    description: `Generates a complete shadcn/ui theme (light and dark) based on the current conversation context. Use this tool once you have a clear understanding of the user's request, which may include a text prompt, images, an SVG, or a base theme reference (@[theme_name]).`,
    inputSchema: z.object({}),
    outputSchema: themeStylesOutputSchema,
    execute: async (_input, { messages, abortSignal, toolCallId, experimental_context }) => {
      const { writer } = experimental_context as AdditionalAIContext;

      const { partialOutputStream, output } = streamText({
        abortSignal,
        model: myProvider.languageModel("theme-generation"),
        providerOptions: baseProviderOptions,
        system: THEME_OBJECT_SYSTEM,
        output: Output.object({
          schema: themeStylesOutputSchema,
        }),
        messages,
      });

      for await (const chunk of partialOutputStream) {
        writer.write({
          id: toolCallId,
          type: "data-generated-theme-styles",
          data: { status: "streaming", themeStyles: chunk },
          transient: true,
        });
      }

      let themeStyles: ThemeObject;

      try {
        themeStyles = await output;
      } catch {
        const repaired = await generateText({
          abortSignal,
          model: myProvider.languageModel("theme-generation"),
          providerOptions: baseProviderOptions,
          output: Output.object({
            schema: themeStylesOutputSchema,
          }),
          system: THEME_OBJECT_SYSTEM,
          messages,
        });

        themeStyles = repaired.output;
      }

      writer.write({
        id: toolCallId,
        type: "data-generated-theme-styles",
        data: { status: "ready", themeStyles },
        transient: true,
      });

      return themeStyles;
    },
  }),
};
