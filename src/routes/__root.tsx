import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

const RootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => {
    return (
      <div className="flex min-h-dvh antialiased">
        <Outlet />

        <ReactQueryDevtools />

        <TanStackRouterDevtools />
      </div>
    );
  },
});

export { RootRoute as Route };
