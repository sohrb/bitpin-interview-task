import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { type Trade, tradeSchema } from "@/entities";
import { api } from "@/lib";

const getTradesResponseSchema = z.array(tradeSchema);

type GetTradesResponse = z.infer<typeof getTradesResponseSchema>;

async function getTrades(marketId: number): Promise<Trade[]> {
  const res = await api.get<GetTradesResponse>(`/v1/mth/matches/${marketId}/`);
  const data = res.data;

  return getTradesResponseSchema.parse(data);
}

export function tradesOptions(marketId: number, opts?: { enabled: boolean }) {
  return queryOptions({
    queryKey: ["trades", marketId],
    queryFn: () => getTrades(marketId),
    enabled: opts?.enabled ?? true,
    staleTime: 3 * 1_000,
    refetchInterval: 3 * 1_000,
  });
}

export function useTrades(marketId: number, opts?: { enabled: boolean }) {
  return useQuery(tradesOptions(marketId, opts));
}
