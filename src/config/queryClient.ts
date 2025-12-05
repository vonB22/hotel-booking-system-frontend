import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient Configuration for TanStack Query
 * Optimized for performance and caching efficiency
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes before marked as stale
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data in cache for 30 minutes before garbage collection
      gcTime: 30 * 60 * 1000,
      
      // Automatically refetch when window regains focus
      refetchOnWindowFocus: true,
      
      // Automatically refetch when connection is restored
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Request timeout: 10 seconds
      networkMode: 'always',
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
      networkMode: 'always',
    },
  },
});
