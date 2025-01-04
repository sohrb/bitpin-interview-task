import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { marketSchema } from "@/domain/entities";
import { axios } from "@/lib";

import { marketsQueryKeys } from "./queryKeys";

const GetMarketsResponseSchema = z.object({
  count: z.number().nonnegative(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(marketSchema),
});

type GetMarketsResponse = z.infer<typeof GetMarketsResponseSchema>;

async function getMarkets(): Promise<GetMarketsResponse> {
  const res = await axios.get<GetMarketsResponse>("/v1/mkt/markets/");
  const data = res.data;

  return GetMarketsResponseSchema.parse(data);
}

export const marketsQueryOptions = (currency2: "USDT" | "IRT") => {
  return queryOptions({
    queryKey: marketsQueryKeys[currency2],
    queryFn: () => getMarkets(),
    select: (data) => {
      return data.results.filter(
        (market) => market.currency2.code === currency2,
      );
    },
  });
};

export function useMarkets(currency2: "USDT" | "IRT") {
  return useQuery(marketsQueryOptions(currency2));
}
