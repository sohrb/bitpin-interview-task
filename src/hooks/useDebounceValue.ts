import { useEffect, useState } from "react";

import { useDebounceCallback } from "./useDebounceCallback";

export function useDebounceValue<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const debouncedCallback = useDebounceCallback(setDebouncedValue, delay);

  useEffect(() => {
    debouncedCallback(value);
  }, [debouncedCallback, value]);

  return debouncedValue;
}
