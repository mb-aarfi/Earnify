export type UserRole = "customer" | "provider";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: UserRole;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface CustomerProfile extends User {
  role: "customer";
  addresses: Address[];
}

export interface MockSession {
  userId: string;
  role: UserRole;
}
