import { z } from "zod";

export const sentenceSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

export type SentenceType = z.infer<typeof sentenceSchema>;
