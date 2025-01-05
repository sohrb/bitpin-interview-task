import { z } from "zod";

import { currencySchema } from "./currency";

export const marketSchema = z.object({
  id: z.number(),
  currency1: currencySchema,
  currency2: currencySchema,
  code: z.string(),
  price: z.string(),
  price_info: z.object({
    change: z.number().nullable(),
  }),
});

export type Market = z.infer<typeof marketSchema>;
