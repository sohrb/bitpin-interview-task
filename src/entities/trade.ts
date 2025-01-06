import { z } from "zod";

export const tradeSchema = z.object({});

export type Trade = z.infer<typeof tradeSchema>;
