"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProviderServices,
  createProviderService,
  updateProviderService,
  deleteProviderService,
} from "@/lib/api/services";
import { queryKeys } from "./query-keys";
import type { ServiceInput } from "@/types/api";
import { toast } from "sonner";

export function useProviderServices(providerId = "prov_1") {
  return useQuery({
    queryKey: queryKeys.providerServices(providerId),
    queryFn: async () => {
      const res = await getProviderServices(providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
  });
}

export function useCreateService(providerId = "prov_1") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceInput) => {
      const res = await createProviderService(input, providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providerServices(providerId) });
      toast.success("Service added successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateService(providerId = "prov_1") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceInput> }) => {
      const res = await updateProviderService(id, data, providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providerServices(providerId) });
      toast.success("Service updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteService(providerId = "prov_1") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteProviderService(id, providerId);
      if (!res.success) throw new Error(res.error?.message);
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providerServices(providerId) });
      toast.success("Service deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
