import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

import {
  Card,
  CardContent,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  ScrollArea,
  ScrollBar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { PAGE_SIZE } from "@/configs";
import { marketsOptions } from "@/hooks/queries";
import { cn } from "@/lib";

const marketsSearchSchema = z.object({
  currency2: fallback(z.enum(["USDT", "IRT"]), "USDT").default("USDT"),
  page: fallback(z.number().nonnegative(), 1).default(1),
  page_size: fallback(z.number().nonnegative(), 10).default(PAGE_SIZE),
});

const MarketsRoute = createFileRoute("/markets/")({
  validateSearch: zodValidator(marketsSearchSchema),
  loaderDeps: ({ search: { currency2 } }) => ({ currency2 }),
  loader: ({ context: { queryClient }, deps: { currency2 } }) =>
    queryClient.ensureQueryData(marketsOptions(currency2)),
  component: MarketsComponent,
});

function MarketsComponent() {
  const navigate = MarketsRoute.useNavigate();
  const currency2 = MarketsRoute.useSearch({
    select(state) {
      return state.currency2;
    },
  });
  const page = MarketsRoute.useSearch({
    select(state) {
      return state.page;
    },
  });
  const pageSize = MarketsRoute.useSearch({
    select(state) {
      return state.page_size;
    },
  });
  const { data: markets } = useSuspenseQuery(marketsOptions(currency2));
  const totalPages = Math.ceil(markets.length / pageSize);

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col p-4 md:p-8">
      <Card className="basis-full bg-background">
        <CardContent className="p-6">
          <Tabs
            value={currency2}
            onValueChange={(value) => {
              const result =
                marketsSearchSchema.shape.currency2.safeParse(value);
              if (result.success) {
                void navigate({ search: { currency2: result.data, page: 1 } });
              }
            }}
          >
            <TabsList className="mb-3 grid grid-cols-2">
              <TabsTrigger value="USDT">USDT</TabsTrigger>

              <TabsTrigger value="IRT">IRT</TabsTrigger>
            </TabsList>

            <TabsContent value={currency2} className="flex flex-col gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={cn(
                        page > 1 ? "cursor-pointer" : "cursor-not-allowed",
                      )}
                      onClick={() => {
                        if (page > 1) {
                          void navigate({
                            search: {
                              currency2,
                              page: page - 1,
                              page_size: pageSize,
                            },
                          });
                        }
                      }}
                      aria-disabled={page === 1}
                    />
                  </PaginationItem>

                  <span className="px-2 md:px-4">
                    {page} of {totalPages}
                  </span>

                  <PaginationItem>
                    <PaginationNext
                      className={cn(
                        page < totalPages
                          ? "cursor-pointer"
                          : "cursor-not-allowed",
                      )}
                      onClick={() => {
                        if (page < totalPages) {
                          void navigate({
                            search: {
                              currency2,
                              page: page + 1,
                              page_size: pageSize,
                            },
                          });
                        }
                      }}
                      aria-disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <ScrollArea className="h-[calc(100dvh-12rem)] md:h-[calc(100dvh-14rem)]">
                <ScrollBar orientation="vertical" />

                <ul className="flex flex-col gap-3">
                  {markets
                    .slice((page - 1) * pageSize, page * pageSize)
                    .map((market) => {
                      return (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                        <li
                          key={market.id}
                          className="flex items-center justify-between rounded-md bg-card p-4 hover:cursor-pointer hover:bg-muted md:p-6"
                          onClick={() => {
                            void navigate({
                              to: "/markets/$marketId",
                              params: { marketId: market.id.toString() },
                            });
                          }}
                        >
                          <div className="flex items-center gap-2 md:gap-4">
                            <img
                              className="h-6 w-6"
                              src={market.currency1.image}
                              alt={`${market.currency1.code}`}
                            />

                            <span className="font-medium">
                              {market.code.replace("_", "/")}
                            </span>
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
                                  <span>
                                    {formattedValue} {market.currency2.code}
                                  </span>
                                );
                              }}
                            />

                            <span
                              className={cn(
                                "hidden sm:block",
                                market.price_info.change > 0 &&
                                  "text-green-500",
                                market.price_info.change === 0 &&
                                  "text-gray-500",
                                market.price_info.change < 0 && "text-red-500",
                              )}
                            >
                              {market.price_info.change > 0 && "+"}
                              {market.price_info.change === 0 && "±"}
                              {market.price_info.change < 0 && "-"}
                              {Math.abs(market.price_info.change)}%
                            </span>
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
