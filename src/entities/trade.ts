import { z } from "zod";

export const tradeSchema = z.object({
  time: z.number(),
  price: z.string(),
  value: z.string(),
  match_amount: z.string(),
  type: z.string(),
  match_id: z.string(),
});

export type Trade = z.infer<typeof tradeSchema>;
