"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerProfile,
  updateCustomerProfile,
  getProviderProfile,
  updateProviderProfile,
} from "@/lib/api/users";
import { getReviews, getRatingDistribution, createReview } from "@/lib/api/reviews";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
} from "@/lib/api/notifications";
import {
  getCurrentLocation,
  getProviderAvailability,
  updateProviderAvailability,
  getProviderEarnings,
  getAvailableTimeSlots,
} from "@/lib/api/location";
import { queryKeys } from "./query-keys";
import type { CustomerProfile } from "@/types/user";
import type { ProviderProfileUpdate } from "@/types/provider";
import type { CreateReviewInput } from "@/types/review";
import type { ProviderAvailability } from "@/types/api";
import { toast } from "sonner";

export function useCustomerProfile() {
  return useQuery({
    queryKey: queryKeys.customerProfile,
    queryFn: async () => {
      const res = await getCustomerProfile();
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<CustomerProfile>) => {
      const res = await updateCustomerProfile(data);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerProfile });
      toast.success("Profile updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useProviderProfile(providerId = "prov_1") {
  return useQuery({
    queryKey: queryKeys.providerProfile(providerId),
    queryFn: async () => {
      const res = await getProviderProfile(providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useUpdateProviderProfile(providerId = "prov_1") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProviderProfileUpdate) => {
      const res = await updateProviderProfile(data, providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providerProfile(providerId) });
      toast.success("Profile updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useReviews(providerId: string) {
  return useQuery({
    queryKey: queryKeys.reviews(providerId),
    queryFn: async () => {
      const res = await getReviews(providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    enabled: !!providerId,
  });
}

export function useRatingDistribution(providerId: string) {
  return useQuery({
    queryKey: queryKeys.ratingDistribution(providerId),
    queryFn: async () => {
      const res = await getRatingDistribution(providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    enabled: !!providerId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const res = await createReview(input);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(vars.providerId) });
      toast.success("Review submitted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: queryKeys.notifications(userId),
    queryFn: async () => {
      const res = await getNotifications(userId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    enabled: !!userId,
  });
}

export function useUnreadCount(userId: string) {
  return useQuery({
    queryKey: queryKeys.unreadCount(userId),
    queryFn: async () => {
      const res = await getUnreadCount(userId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!.count;
    },
    enabled: !!userId,
  });
}

export function useMarkNotificationRead(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount(userId) });
    },
  });
}

export function useMarkAllNotificationsRead(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount(userId) });
    },
  });
}

export function useLocation() {
  return useQuery({
    queryKey: queryKeys.location,
    queryFn: async () => {
      const res = await getCurrentLocation();
      return res.data!;
    },
  });
}

export function useProviderAvailability(providerId = "prov_1") {
  return useQuery({
    queryKey: queryKeys.availability(providerId),
    queryFn: async () => {
      const res = await getProviderAvailability(providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useUpdateProviderAvailability(providerId = "prov_1") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProviderAvailability) => {
      const res = await updateProviderAvailability(data);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availability(providerId) });
      toast.success("Availability updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useProviderEarnings(providerId = "prov_1") {
  return useQuery({
    queryKey: queryKeys.earnings(providerId),
    queryFn: async () => {
      const res = await getProviderEarnings(providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useAvailableTimeSlots(date: string, providerId?: string) {
  return useQuery({
    queryKey: queryKeys.timeSlots(date, providerId),
    queryFn: async () => {
      const res = await getAvailableTimeSlots(date, providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    enabled: !!date,
  });
}
