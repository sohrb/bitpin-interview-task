import { z } from "zod";

export const currencySchema = z.object({
  code: z.string(),
});

export type Currency = z.infer<typeof currencySchema>;
