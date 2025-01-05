import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

import {
  Card,
  CardContent,
  ScrollArea,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { marketOptions } from "@/hooks/queries";
import { cn } from "@/lib";

const marketSearchSchema = z.object({
  currency2: fallback(z.enum(["USDT", "IRT"]), "USDT").default("USDT"),
});

const MarketsRoute = createFileRoute("/markets/")({
  validateSearch: zodValidator(marketSearchSchema),
  loaderDeps: ({ search: { currency2 } }) => ({ currency2 }),
  loader: ({ context: { queryClient }, deps: { currency2 } }) =>
    queryClient.ensureQueryData(marketOptions(currency2)),
  component: MarketsComponent,
});

function MarketsComponent() {
  const navigate = MarketsRoute.useNavigate();
  const currency2 = MarketsRoute.useSearch({
    select(state) {
      return state.currency2;
    },
  });
  const { data: markets } = useSuspenseQuery(marketOptions(currency2));

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col p-4 md:p-8">
      <Card className="basis-full bg-background">
        <CardContent className="p-6">
          <Tabs
            value={currency2}
            onValueChange={(value) => {
              const result =
                marketSearchSchema.shape.currency2.safeParse(value);
              if (result.success) {
                void navigate({ search: { currency2: result.data } });
              }
            }}
          >
            <TabsList className="mb-3 grid grid-cols-2">
              <TabsTrigger value="USDT">USDT</TabsTrigger>

              <TabsTrigger value="IRT">IRT</TabsTrigger>
            </TabsList>

            <TabsContent value={currency2}>
              <ScrollArea className="h-[calc(100dvh-9rem)] md:h-[calc(100dvh-11rem)]">
                <ScrollBar orientation="vertical" />

                <ul className="flex flex-col gap-3">
                  {markets.map((market) => {
                    return (
                      <li
                        key={market.id}
                        className="flex items-center justify-between rounded-md bg-card p-4 hover:bg-muted md:p-6"
                      >
                        <div className="flex items-center gap-2 md:gap-4">
                          <img
                            className="h-6 w-6"
                            src={market.currency1.image}
                            alt={`${market.currency1.code}`}
                          />

                          <p className="font-medium">
                            {market.code.replace("_", "/")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                          <NumericFormat
                            displayType="text"
                            thousandSeparator
                            valueIsNumericString
                            allowLeadingZeros={false}
                            allowNegative={false}
                            value={market.price}
                            renderText={(formattedValue) => {
                              return (
                                <p>
                                  {formattedValue} {market.currency2.code}
                                </p>
                              );
                            }}
                          />

                          <p
                            className={cn(
                              market.price_info.change > 0 && "text-green-500",
                              market.price_info.change === 0 && "text-gray-500",
                              market.price_info.change < 0 && "text-red-500",
                            )}
                          >
                            {market.price_info.change > 0 && "+"}
                            {market.price_info.change === 0 && "±"}
                            {market.price_info.change < 0 && "-"}
                            {Math.abs(market.price_info.change)}%
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export { MarketsRoute as Route };
