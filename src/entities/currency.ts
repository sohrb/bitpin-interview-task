import { z } from "zod";

export const currencySchema = z.object({
  id: z.number(),
  code: z.string(),
  image: z.string().url(),
});

export type Currency = z.infer<typeof currencySchema>;