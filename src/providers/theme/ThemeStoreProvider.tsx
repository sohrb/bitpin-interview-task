import { useEffect, useRef } from "react";
import { useStore } from "zustand";

import { createThemeStore } from "./createThemeStore";
import { ThemeStoreContext } from "./ThemeStoreContext";
import type { Theme, ThemeStore } from "./types";

interface ThemeStoreProviderProps extends React.PropsWithChildren {
  defaultTheme: Theme;
  storageKey: string;
}

export function ThemeStoreProvider({
  defaultTheme,
  storageKey,
  children,
}: ThemeStoreProviderProps) {
  const themeStoreRef = useRef<ThemeStore>(
    createThemeStore(defaultTheme, storageKey),
  );
  const theme = useStore(themeStoreRef.current, (state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: light)")
        .matches
        ? "light"
        : "dark";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeStoreContext value={themeStoreRef.current}>
      {children}
    </ThemeStoreContext>
  );
}
