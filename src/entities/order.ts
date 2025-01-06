import { z } from "zod";

export const orderSchema = z.object({
  amount: z.string(),
  remain: z.string(),
  price: z.string(),
  value: z.string(),
});

export type Order = z.infer<typeof orderSchema>;
