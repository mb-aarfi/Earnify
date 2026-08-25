export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface DayAvailability {
  day: string;
  dayIndex: number;
  available: boolean;
  slots: TimeSlot[];
}

export interface ProviderAvailability {
  providerId: string;
  schedule: DayAvailability[];
  vacationMode: boolean;
}

export interface EarningsSummary {
  totalEarnings: number;
  thisMonth: number;
  thisWeek: number;
  pending: number;
  completedJobs: number;
  currency: string;
}

export interface EarningsDataPoint {
  month: string;
  earnings: number;
}

export interface ServiceInput {
  name: string;
  categoryId: string;
  description: string;
  price: number;
  durationMinutes: number;
  durationLabel: string;
  active: boolean;
}
