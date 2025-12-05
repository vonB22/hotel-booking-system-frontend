import { useState, useEffect, useCallback } from 'react';

/**
 * useDebounce Hook
 * Debounces a value to reduce API calls for search/filter operations
 * 
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useThrottle Hook
 * Throttles a function to prevent excessive calls
 * 
 * @param callback - Function to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [lastRun, setLastRun] = useState(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun >= delay) {
        callback(...args);
        setLastRun(Date.now());
      }
    }) as T,
    [callback, delay, lastRun]
  );
}

/**
 * useDebouncedCallback Hook
 * Debounces a callback function
 * 
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [timeout, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = useCallback(
    ((...args: any[]) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      const timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
      setTimeoutId(timeoutId);
    }) as T,
    [callback, delay, timeout]
  );

  return debouncedCallback;
}
