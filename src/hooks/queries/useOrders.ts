import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { type Order, orderSchema } from "@/entities";
import { api } from "@/lib";

const getOrdersResponseSchema = z.object({
  orders: z.array(orderSchema),
});

type GetOrdersResponse = z.infer<typeof getOrdersResponseSchema>;

async function getOrders(
  marketId: number,
  type: "buy" | "sell",
): Promise<Order[]> {
  const res = await api.get<GetOrdersResponse>(
    `/v2/mth/actives/${marketId}/?type=${type}`,
  );
  const data = res.data;

  return getOrdersResponseSchema.parse(data).orders;
}

export function ordersOptions(
  marketId: number,
  type: "buy" | "sell",
  opts?: { enabled: boolean },
) {
  return queryOptions({
    queryKey: ["orders", type, marketId],
    queryFn: () => getOrders(marketId, type),
    enabled: opts?.enabled ?? true,
    staleTime: 3 * 1_000,
    refetchInterval: 3 * 1_000,
  });
}

export function useOrders(
  marketId: number,
  type: "buy" | "sell",
  opts?: { enabled: boolean },
) {
  return useQuery(ordersOptions(marketId, type, opts));
}
