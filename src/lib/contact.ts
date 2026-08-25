"use client";

import { contactProvider } from "@/lib/api/location";
import { toast } from "sonner";

export async function handleCallProvider(providerId: string) {
  const res = await contactProvider({ providerId, method: "call" });
  if (res.success && res.data && "phone" in res.data) {
    window.location.href = `tel:${res.data.phone}`;
  } else {
    toast.error("Could not retrieve phone number");
  }
}

export async function handleMessageProvider(providerId: string) {
  void providerId;
  toast.info("Messaging coming soon");
}
