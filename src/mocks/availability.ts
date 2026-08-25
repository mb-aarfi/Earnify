import type { ProviderAvailability, EarningsSummary, EarningsDataPoint } from "@/types/api";

export const mockProviderAvailability: ProviderAvailability = {
  providerId: "prov_1",
  vacationMode: false,
  schedule: [
    {
      day: "Monday",
      dayIndex: 1,
      available: true,
      slots: [{ id: "mon_1", startTime: "09:00", endTime: "18:00", available: true }],
    },
    {
      day: "Tuesday",
      dayIndex: 2,
      available: true,
      slots: [{ id: "tue_1", startTime: "09:00", endTime: "18:00", available: true }],
    },
    {
      day: "Wednesday",
      dayIndex: 3,
      available: true,
      slots: [{ id: "wed_1", startTime: "09:00", endTime: "18:00", available: true }],
    },
    {
      day: "Thursday",
      dayIndex: 4,
      available: true,
      slots: [{ id: "thu_1", startTime: "09:00", endTime: "18:00", available: true }],
    },
    {
      day: "Friday",
      dayIndex: 5,
      available: true,
      slots: [{ id: "fri_1", startTime: "09:00", endTime: "18:00", available: true }],
    },
    {
      day: "Saturday",
      dayIndex: 6,
      available: true,
      slots: [{ id: "sat_1", startTime: "10:00", endTime: "16:00", available: true }],
    },
    {
      day: "Sunday",
      dayIndex: 0,
      available: false,
      slots: [],
    },
  ],
};

export const mockEarningsSummary: EarningsSummary = {
  totalEarnings: 87450,
  thisMonth: 12400,
  thisWeek: 3200,
  pending: 1498,
  completedJobs: 156,
  currency: "INR",
};

export const mockEarningsChart: EarningsDataPoint[] = [
  { month: "Mar", earnings: 8200 },
  { month: "Apr", earnings: 9800 },
  { month: "May", earnings: 11200 },
  { month: "Jun", earnings: 10500 },
  { month: "Jul", earnings: 13100 },
  { month: "Aug", earnings: 12400 },
];

export const availableTimeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];
