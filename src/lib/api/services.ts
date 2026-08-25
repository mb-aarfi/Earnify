import { simulateApiCall } from "@/lib/api/client";
import { generateId } from "@/lib/utils";
import { mockProviders } from "@/mocks/providers";
import type { ServiceInput } from "@/types/api";
import type { Service } from "@/types/provider";

const providerId = "prov_1";

export async function getProviderServices(pid = providerId) {
  const provider = mockProviders.find((p) => p.id === pid);
  return simulateApiCall(provider?.services ?? []);
}

export async function createProviderService(input: ServiceInput, pid = providerId) {
  const provider = mockProviders.find((p) => p.id === pid);
  if (!provider) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Provider not found" } };
  }

  const service: Service = {
    id: generateId("svc"),
    ...input,
    currency: "INR",
  };
  provider.services.push(service);
  return simulateApiCall(service);
}

export async function updateProviderService(
  serviceId: string,
  input: Partial<ServiceInput>,
  pid = providerId
) {
  const provider = mockProviders.find((p) => p.id === pid);
  const service = provider?.services.find((s) => s.id === serviceId);
  if (!service) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Service not found" } };
  }
  Object.assign(service, input);
  return simulateApiCall(service);
}

export async function deleteProviderService(serviceId: string, pid = providerId) {
  const provider = mockProviders.find((p) => p.id === pid);
  if (!provider) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Provider not found" } };
  }
  provider.services = provider.services.filter((s) => s.id !== serviceId);
  return simulateApiCall({ deleted: true });
}
