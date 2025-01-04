import { z } from "zod";

import { currencySchema } from "./currency";

export const marketSchema = z.object({
  currency1: currencySchema,
  currency2: currencySchema,
});

export type Market = z.infer<typeof marketSchema>;
