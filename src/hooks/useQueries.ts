import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import apiService from '../services/api';
import { queryClient } from '../config/queryClient';

/**
 * TanStack Query Hooks for optimized data fetching
 * These hooks provide automatic caching, refetching, and request deduplication
 */

// ============ BOOKINGS HOOKS ============

export const useBookings = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['bookings', page, limit],
    queryFn: () => apiService.getBookings(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBooking = (id: string | number) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => apiService.getBooking(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (data: any) => apiService.createBooking(data),
    onSuccess: () => {
      // Invalidate bookings cache to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBooking = (id: string | number) => {
  return useMutation({
    mutationFn: (data: any) => apiService.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useDeleteBooking = () => {
  return useMutation({
    mutationFn: (id: string | number) => apiService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// ============ HOTELS HOOKS ============

export const useHotels = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['hotels', page, limit],
    queryFn: () => apiService.getHotels(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useHotel = (id: string | number) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => apiService.getHotel(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateHotel = () => {
  return useMutation({
    mutationFn: (data: any) => apiService.createHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
};

export const useUpdateHotel = (id: string | number) => {
  return useMutation({
    mutationFn: (data: any) => apiService.updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel', id] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
};

export const useDeleteHotel = () => {
  return useMutation({
    mutationFn: (id: string | number) => apiService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
};

// ============ USERS HOOKS ============

export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => apiService.getUsers(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (id: string | number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => apiService.getUser(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: any) => apiService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = (id: string | number) => {
  return useMutation({
    mutationFn: (data: any) => apiService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id: string | number) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// ============ ROLES HOOKS ============

export const useRoles = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['roles', page, limit],
    queryFn: () => apiService.getRoles(page, limit),
    staleTime: 10 * 60 * 1000, // Roles change less frequently
  });
};

export const useRole = (id: string | number) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => apiService.getRole(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
};

export const useCreateRole = () => {
  return useMutation({
    mutationFn: (data: any) => apiService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = (id: string | number) => {
  return useMutation({
    mutationFn: (data: any) => apiService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (id: string | number) => apiService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// ============ OVERVIEW/DASHBOARD HOOKS ============

export const useOverviewStats = () => {
  return useQuery({
    queryKey: ['overview-stats'],
    queryFn: () => apiService.getOverviewStats(),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });
};

export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: () => apiService.getOverview(),
    staleTime: 5 * 60 * 1000,
  });
};

// ============ SEARCH HOOKS (DEBOUNCED) ============

export const useSearchHotels = (searchTerm: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['search-hotels', searchTerm, page, limit],
    queryFn: () => apiService.searchHotels(searchTerm, page, limit),
    enabled: searchTerm.length > 0,
    staleTime: 2 * 60 * 1000,
  });
};

// ============ INFINITE QUERY HOOKS (FOR PAGINATION) ============

export const useInfiniteBookings = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['infinite-bookings'],
    queryFn: ({ pageParam = 1 }) => apiService.getBookings(pageParam, limit),
    getNextPageParam: (_lastPage, pages) => pages.length + 1,
    initialPageParam: 1,
  });
};

export const useInfiniteHotels = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['infinite-hotels'],
    queryFn: ({ pageParam = 1 }) => apiService.getHotels(pageParam, limit),
    getNextPageParam: (_lastPage, pages) => pages.length + 1,
    initialPageParam: 1,
  });
};
