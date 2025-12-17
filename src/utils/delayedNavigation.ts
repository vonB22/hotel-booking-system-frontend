/**
 * Navigate to a path after a specified delay
 * Allows toast messages to be visible before navigation
 */
export const navigateWithDelay = (navigate: (path: string) => void, path: string, delayMs = 1500) => {
  setTimeout(() => {
    navigate(path);
  }, delayMs);
};
