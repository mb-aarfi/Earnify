"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  getProviderBookings,
  updateBookingStatus,
} from "@/lib/api/bookings";
import { queryKeys } from "./query-keys";
import type { BookingStatus, CreateBookingInput } from "@/types/booking";
import { toast } from "sonner";

export function useBookings(customerId?: string, status?: BookingStatus) {
  return useQuery({
    queryKey: queryKeys.bookings(customerId, status),
    queryFn: async () => {
      const res = await getBookings(customerId, status);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: async () => {
      const res = await getBookingById(id);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const res = await createBooking(input);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["providerBookings"] });
      toast.success("Booking created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create booking");
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await cancelBooking(id);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(id) });
      toast.success("Booking cancelled");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel booking");
    },
  });
}

export function useProviderBookings(providerId: string, status?: BookingStatus) {
  return useQuery({
    queryKey: queryKeys.providerBookings(providerId, status),
    queryFn: async () => {
      const res = await getProviderBookings(providerId, status);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const res = await updateBookingStatus(id, status);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["providerBookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.booking(data.id) });
      const messages: Partial<Record<BookingStatus, string>> = {
        accepted: "Booking accepted",
        rejected: "Booking rejected",
        in_progress: "Job started",
        completed: "Job completed",
        confirmed: "Booking confirmed",
      };
      toast.success(messages[data.status] ?? "Booking updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update booking");
    },
  });
}
