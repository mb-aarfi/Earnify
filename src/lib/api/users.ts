import { simulateApiCall } from "@/lib/api/client";
import { mockCustomer, mockProviderUser } from "@/mocks/users";
import { mockProviders } from "@/mocks/providers";
import type { CustomerProfile } from "@/types/user";
import type { ProviderProfileUpdate } from "@/types/provider";

export async function getCustomerProfile() {
  return simulateApiCall(mockCustomer);
}

export async function updateCustomerProfile(data: Partial<CustomerProfile>) {
  Object.assign(mockCustomer, data);
  return simulateApiCall(mockCustomer);
}

export async function getProviderProfile(providerId = "prov_1") {
  const provider = mockProviders.find((p) => p.id === providerId);
  if (!provider) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Provider not found" } };
  }
  return simulateApiCall({
    ...provider,
    user: mockProviderUser,
  });
}

export async function updateProviderProfile(data: ProviderProfileUpdate, providerId = "prov_1") {
  const provider = mockProviders.find((p) => p.id === providerId);
  if (!provider) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Provider not found" } };
  }
  Object.assign(provider, data);
  return simulateApiCall(provider);
}

export async function getContactPhone(providerId: string) {
  const provider = mockProviders.find((p) => p.id === providerId);
  if (!provider) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Provider not found" } };
  }
  return simulateApiCall({ phone: provider.phone });
}
