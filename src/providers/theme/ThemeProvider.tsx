import { ThemeStoreProvider } from "./ThemeStoreProvider";
import type { Theme } from "./types";

interface ThemeProviderProps extends React.PropsWithChildren {
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}: ThemeProviderProps) {
  return (
    <ThemeStoreProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeStoreProvider>
  );
}
