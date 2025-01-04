import { createContext } from "react";

import type { ThemeStore } from "./types";

export const ThemeStoreContext = createContext<ThemeStore | null>(null);
