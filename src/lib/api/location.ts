import { simulateApiCall } from "@/lib/api/client";
import {
  mockProviderAvailability,
  mockEarningsSummary,
  mockEarningsChart,
  availableTimeSlots,
} from "@/mocks/availability";
import { defaultLocation } from "@/mocks/location";
import type { ProviderAvailability } from "@/types/api";

export async function getCurrentLocation() {
  return simulateApiCall(defaultLocation);
}

export async function getProviderAvailability(providerId = "prov_1") {
  return simulateApiCall({ ...mockProviderAvailability, providerId });
}

export async function updateProviderAvailability(data: ProviderAvailability) {
  Object.assign(mockProviderAvailability, data);
  return simulateApiCall(mockProviderAvailability);
}

export async function getProviderEarnings(providerId = "prov_1") {
  return simulateApiCall({
    summary: mockEarningsSummary,
    chart: mockEarningsChart,
    providerId,
  });
}

export async function getAvailableTimeSlots(date: string, providerId?: string) {
  void date;
  void providerId;
  return simulateApiCall(availableTimeSlots);
}

export interface ContactProviderParams {
  providerId: string;
  method: "call" | "message";
}

export async function contactProvider(params: ContactProviderParams) {
  if (params.method === "message") {
    return simulateApiCall({ message: "Messaging coming soon" });
  }
  const { getContactPhone } = await import("@/lib/api/users");
  return getContactPhone(params.providerId);
}
