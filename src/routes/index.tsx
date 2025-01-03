import { createFileRoute } from "@tanstack/react-router";

export const IndexRoute = createFileRoute("/")({
  component: () => {
    return <></>;
  },
});

export { IndexRoute as Route };
