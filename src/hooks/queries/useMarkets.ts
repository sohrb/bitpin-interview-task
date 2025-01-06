import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { IRT_DP_PLACES, USDT_DP_PLACES } from "@/configs";
import { type Market, marketSchema } from "@/entities";
import { api, toDecimal } from "@/lib";

const getMarketsResponseSchema = z.object({
  results: z.array(marketSchema),
});

type GetMarketsResponse = z.infer<typeof getMarketsResponseSchema>;

async function getMarkets(): Promise<Market[]> {
  const res = await api.get<GetMarketsResponse>("/v1/mkt/markets/");
  const data = res.data;

  return getMarketsResponseSchema.parse(data).results;
}

export function marketOptions(id: number) {
  return queryOptions({
    queryKey: ["markets", id],
    queryFn: getMarkets,
    select: (markets) => {
      const market = markets.find((market) => market.id === id);
      if (!market) {
        return undefined;
      }

      return {
        ...market,
        price:
          market.currency2.code === "IRT"
            ? toDecimal(market.price).toDP(IRT_DP_PLACES).toFixed()
            : toDecimal(market.price).toDP(USDT_DP_PLACES).toFixed(),
        price_info: {
          change: market.price_info.change
            ? Number(toDecimal(market.price_info.change).toDP(2).toFixed())
            : 0,
        },
      };
    },
    staleTime: Infinity,
  });
}

export function marketsOptions(currency2: string) {
  return queryOptions({
    queryKey: ["markets", currency2],
    queryFn: getMarkets,
    select: (markets) => {
      return markets
        .filter((market) => market.currency2.code === currency2)
        .map(({ price, price_info, ...rest }) => {
          return {
            ...rest,
            price:
              rest.currency2.code === "IRT"
                ? toDecimal(price).toDP(IRT_DP_PLACES).toFixed()
                : toDecimal(price).toDP(USDT_DP_PLACES).toFixed(),
            price_info: {
              change: price_info.change
                ? Number(toDecimal(price_info.change).toDP(2).toFixed())
                : 0,
            },
          };
        });
    },
    staleTime: Infinity,
  });
}

export function useMarkets(currency2: string) {
  return useQuery(marketsOptions(currency2));
}

export function useMarket(id: number) {
  return useQuery(marketOptions(id));
}
