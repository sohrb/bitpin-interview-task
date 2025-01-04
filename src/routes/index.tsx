import { createFileRoute, Navigate } from "@tanstack/react-router";

const IndexRoute = createFileRoute("/")({
  component: () => {
    return <Navigate to="/markets" />;
  },
});

export { IndexRoute as Route };
