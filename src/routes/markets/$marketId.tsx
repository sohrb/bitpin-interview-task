import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import Decimal from "decimal.js";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  ScrollArea,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useDebounceValue } from "@/hooks";
import { marketOptions, ordersOptions } from "@/hooks/queries";
import { toDecimal } from "@/lib";

const marketSearchSchema = z.object({
  tab: fallback(z.enum(["buy", "sell", "trades"]), "buy").default("buy"),
});

const MarketRoute = createFileRoute("/markets/$marketId")({
  validateSearch: zodValidator(marketSearchSchema),
  loader: ({ params: { marketId }, context: { queryClient } }) => {
    void queryClient.ensureQueryData(marketOptions(Number(marketId)));
  },
  component: MarketComponent,
});

function MarketComponent() {
  const navigate = MarketRoute.useNavigate();
  const marketId = Number(
    MarketRoute.useParams({
      select(params) {
        return params.marketId;
      },
    }),
  );
  const tab = MarketRoute.useSearch({
    select(state) {
      return state.tab;
    },
  });
  const { data: market } = useSuspenseQuery(marketOptions(marketId));
  const { data } = useQuery(
    ordersOptions(marketId, tab as "buy" | "sell", {
      enabled: tab !== "trades",
    }),
  );

  const orders = useMemo(() => {
    return data ? data.slice(0, 10) : [];
  }, [data]);

  const totalValue = useMemo(() => {
    return orders.length > 0
      ? Decimal.sum(...orders.map((order) => order.value)).toFixed()
      : undefined;
  }, [orders]);

  const totalRemain = useMemo(() => {
    return orders.length > 0
      ? Decimal.sum(...orders.map((order) => order.remain)).toFixed()
      : undefined;
  }, [orders]);

  const weightedAveragePrice = useMemo(() => {
    return orders.length > 0 && !!totalRemain && Number(totalRemain) !== 0
      ? Decimal.sum(
          ...orders.map((order) => toDecimal(order.remain).mul(order.price)),
        )
          .dividedBy(totalRemain)
          .toFixed()
      : undefined;
  }, [orders, totalRemain]);

  const [totalRemainPercentage, setTotalRemainPercentage] =
    useState<string>("");
  const debouncedTotalRemainPercentage = useDebounceValue(
    totalRemainPercentage,
  );

  const remain = useMemo(() => {
    return orders.length > 0 &&
      !!debouncedTotalRemainPercentage &&
      !!totalRemain
      ? toDecimal(debouncedTotalRemainPercentage)
          .dividedBy(100)
          .mul(totalRemain)
          .toFixed()
      : undefined;
  }, [debouncedTotalRemainPercentage, orders.length, totalRemain]);

  const payable = useMemo(() => {
    return remain && weightedAveragePrice && debouncedTotalRemainPercentage
      ? toDecimal(debouncedTotalRemainPercentage)
          .dividedBy(100)
          .mul(weightedAveragePrice)
          .toFixed()
      : undefined;
  }, [debouncedTotalRemainPercentage, remain, weightedAveragePrice]);

  useEffect(() => {
    setTotalRemainPercentage("");
  }, [tab]);

  if (!market) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col p-4 md:p-8">
      <Card className="basis-full bg-background">
        <CardHeader>
          <CardTitle className="space-x-2">
            <img
              className="inline-block h-8 w-8"
              src={market.currency1.image}
              alt={`${market.currency1.code}`}
            />

            <span>{market.code.replace("_", "/")}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              const result = marketSearchSchema.shape.tab.safeParse(value);
              if (result.success) {
                void navigate({ search: { tab: result.data } });
              }
            }}
          >
            <TabsList className="mb-3 grid grid-cols-3">
              <TabsTrigger value="buy">Buy</TabsTrigger>

              <TabsTrigger value="sell">Sell</TabsTrigger>

              <TabsTrigger value="trades">Trades</TabsTrigger>
            </TabsList>

            <NumericFormat
              displayType="input"
              customInput={Input}
              className="mb-2 hidden md:block"
              valueIsNumericString
              allowLeadingZeros
              allowNegative
              decimalScale={2}
              value={totalRemainPercentage}
              onValueChange={({ value }) => {
                setTotalRemainPercentage(value);
              }}
              thousandSeparator
              placeholder="Total Remain Percentage"
            />

            <div className="mb-2 hidden grid-cols-2 place-items-center rounded-md border-[1px] border-border p-4 md:grid md:p-6">
              <span>Remain:</span>

              <span>Payable:</span>

              <NumericFormat
                displayType="text"
                thousandSeparator
                valueIsNumericString
                allowLeadingZeros={false}
                allowNegative={false}
                value={remain ?? ""}
                renderText={(formattedValue) => {
                  return <span>{formattedValue}</span>;
                }}
              />

              <NumericFormat
                displayType="text"
                thousandSeparator
                valueIsNumericString
                allowLeadingZeros={false}
                allowNegative={false}
                value={payable ?? ""}
                renderText={(formattedValue) => {
                  return <span>{formattedValue}</span>;
                }}
              />
            </div>

            <div className="hidden grid-cols-3 place-items-center rounded-md border-[1px] border-border p-4 md:grid md:p-6">
              <span>Total Remain:</span>

              <span>Weighted Avg Price:</span>

              <span>Total Value:</span>

              <NumericFormat
                displayType="text"
                thousandSeparator
                valueIsNumericString
                allowLeadingZeros={false}
                allowNegative={false}
                value={totalRemain ?? ""}
                renderText={(formattedValue) => {
                  return <span>{formattedValue}</span>;
                }}
              />

              <NumericFormat
                displayType="text"
                thousandSeparator
                valueIsNumericString
                allowLeadingZeros={false}
                allowNegative={false}
                value={weightedAveragePrice ?? ""}
                renderText={(formattedValue) => {
                  return <span>{formattedValue}</span>;
                }}
              />

              <NumericFormat
                displayType="text"
                thousandSeparator
                valueIsNumericString
                allowLeadingZeros={false}
                allowNegative={false}
                value={totalValue ?? ""}
                renderText={(formattedValue) => {
                  return <span>{formattedValue}</span>;
                }}
              />
            </div>

            {tab !== "trades" && (
              <TabsContent value={tab}>
                <ScrollArea className="h-[calc(100dvh-12rem)] md:h-[calc(100dvh-31rem)]">
                  <ScrollBar orientation="vertical" />

                  <ul className="flex flex-col gap-3">
                    {orders.map((order, index) => {
                      return (
                        <li
                          key={index}
                          className="grid grid-cols-3 place-items-center rounded-md bg-card p-4 hover:cursor-pointer hover:bg-muted md:p-6"
                        >
                          <span>Remain:</span>

                          <span>Price:</span>

                          <span>Value:</span>

                          <NumericFormat
                            displayType="text"
                            thousandSeparator
                            valueIsNumericString
                            allowLeadingZeros={false}
                            allowNegative={false}
                            value={order.remain}
                            renderText={(formattedValue) => {
                              return <span>{formattedValue}</span>;
                            }}
                          />

                          <NumericFormat
                            displayType="text"
                            thousandSeparator
                            valueIsNumericString
                            allowLeadingZeros={false}
                            allowNegative={false}
                            value={order.price}
                            renderText={(formattedValue) => {
                              return <span>{formattedValue}</span>;
                            }}
                          />

                          <NumericFormat
                            displayType="text"
                            thousandSeparator
                            valueIsNumericString
                            allowLeadingZeros={false}
                            allowNegative={false}
                            value={order.value}
                            renderText={(formattedValue) => {
                              return <span>{formattedValue}</span>;
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </TabsContent>
            )}

            {tab === "trades" && <TabsContent value={tab}></TabsContent>}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export { MarketRoute as Route };
