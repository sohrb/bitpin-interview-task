import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const appElement = document.getElementById("app");
if (!appElement) {
  throw new Error("Failed to find the app element");
}

const root = createRoot(appElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
