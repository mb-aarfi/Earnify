import { delay } from "@/lib/utils";
import type { ApiResponse } from "@/types/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export const API_CONFIG = {
  useMock: USE_MOCK,
  baseUrl: API_BASE_URL,
  defaultDelay: 400,
};

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    throw new Error(`Mock mode: use service functions instead of apiRequest for ${endpoint}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  return response.json() as Promise<ApiResponse<T>>;
}

export async function simulateApiCall<T>(
  data: T,
  ms = API_CONFIG.defaultDelay
): Promise<ApiResponse<T>> {
  await delay(ms);
  return {
    success: true,
    data,
    message: "Success",
  };
}

export async function simulateApiError(
  code: string,
  message: string,
  ms = API_CONFIG.defaultDelay
): Promise<ApiResponse<never>> {
  await delay(ms);
  return {
    success: false,
    error: { code, message },
  };
}
