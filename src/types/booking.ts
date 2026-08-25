export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  providerId: string;
  providerName: string;
  providerImage?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  description: string;
  attachments?: string[];
  estimatedPrice: number;
  currency: string;
  status: BookingStatus;
  distanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  addressId: string;
  description: string;
  attachments?: string[];
}

export interface BookingTimelineEvent {
  status: BookingStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
}
