import { simulateApiCall } from "@/lib/api/client";
import { generateId } from "@/lib/utils";
import { mockBookings } from "@/mocks/bookings";
import { mockProviders } from "@/mocks/providers";
import { mockCustomer } from "@/mocks/users";
import type { Booking, BookingStatus, CreateBookingInput, BookingTimelineEvent } from "@/types/booking";

export async function createBooking(input: CreateBookingInput) {
  const provider = mockProviders.find((p) => p.id === input.providerId);
  const service = provider?.services.find((s) => s.id === input.serviceId);
  const address = mockCustomer.addresses.find((a) => a.id === input.addressId);

  if (!provider || !service || !address) {
    return {
      success: false as const,
      error: { code: "VALIDATION_ERROR", message: "Invalid booking data" },
    };
  }

  const booking: Booking = {
    id: generateId("booking"),
    customerId: mockCustomer.id,
    customerName: mockCustomer.name,
    customerPhone: mockCustomer.phone,
    providerId: provider.id,
    providerName: provider.name,
    providerImage: provider.profileImage,
    serviceId: service.id,
    serviceName: service.name,
    date: input.date,
    time: input.time,
    address: {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
    },
    description: input.description,
    attachments: input.attachments,
    estimatedPrice: service.price,
    currency: service.currency,
    status: "pending",
    distanceKm: provider.distanceKm,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockBookings.unshift(booking);
  return simulateApiCall({ id: booking.id, status: booking.status as BookingStatus });
}

export async function getBookings(customerId?: string, status?: BookingStatus) {
  let bookings = [...mockBookings];
  if (customerId) {
    bookings = bookings.filter((b) => b.customerId === customerId);
  }
  if (status) {
    bookings = bookings.filter((b) => b.status === status);
  }
  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return simulateApiCall(bookings);
}

export async function getBookingById(id: string) {
  const booking = mockBookings.find((b) => b.id === id);
  if (!booking) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Booking not found" } };
  }
  return simulateApiCall(booking);
}

export async function cancelBooking(id: string) {
  const booking = mockBookings.find((b) => b.id === id);
  if (!booking) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Booking not found" } };
  }
  booking.status = "cancelled";
  booking.updatedAt = new Date().toISOString();
  return simulateApiCall(booking);
}

export async function getProviderBookings(providerId: string, status?: BookingStatus) {
  let bookings = mockBookings.filter((b) => b.providerId === providerId);
  if (status) {
    bookings = bookings.filter((b) => b.status === status);
  }
  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return simulateApiCall(bookings);
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const booking = mockBookings.find((b) => b.id === id);
  if (!booking) {
    return { success: false as const, error: { code: "NOT_FOUND", message: "Booking not found" } };
  }
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  return simulateApiCall(booking);
}

export function getBookingTimeline(status: BookingStatus): BookingTimelineEvent[] {
  const steps: { status: BookingStatus; label: string }[] = [
    { status: "pending", label: "Booking requested" },
    { status: "accepted", label: "Provider accepted" },
    { status: "confirmed", label: "Appointment confirmed" },
    { status: "in_progress", label: "Work started" },
    { status: "completed", label: "Completed" },
  ];

  const statusOrder: BookingStatus[] = [
    "pending",
    "accepted",
    "confirmed",
    "in_progress",
    "completed",
  ];

  const currentIndex =
    status === "cancelled" || status === "rejected"
      ? -1
      : statusOrder.indexOf(status);

  return steps.map((step, index) => ({
    ...step,
    completed: currentIndex >= index,
    timestamp: index <= currentIndex ? new Date().toISOString() : undefined,
  }));
}
