import type { createThemeStore } from "./createThemeStore";

export type Theme = "dark" | "light" | "system";

export interface ThemeStoreState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type ThemeStore = ReturnType<typeof createThemeStore>;
