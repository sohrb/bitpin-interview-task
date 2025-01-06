import { useCallback, useRef } from "react";

export function useDebounceCallback<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any) => ReturnType<T>,
>(callback: T, delay = 500) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedCallback = useCallback<(...args: Parameters<T>) => void>(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
}
