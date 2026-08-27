import type { CustomerProfile } from "@/types/user";

export const mockCustomer: CustomerProfile = {
  id: "user_customer_1",
  name: "Saif Husain",
  email: "saif.husain@gmail.com",
  phone: "+919876543210",
  profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  role: "customer",
  createdAt: "2024-06-15T10:00:00Z",
  addresses: [
    {
      id: "addr_1",
      label: "Home",
      line1: "42 Gomti Nagar Extension",
      line2: "Near City Mall",
      city: "Lucknow",
      state: "Uttar Pradesh",
      postalCode: "226010",
      isDefault: true,
    },
    {
      id: "addr_2",
      label: "Office",
      line1: "15 Hazratganj Road",
      city: "Lucknow",
      state: "Uttar Pradesh",
      postalCode: "226001",
      isDefault: false,
    },
    {
      id: "addr_3",
      label: "Parents Home",
      line1: "78 Civil Lines",
      city: "Kanpur",
      state: "Uttar Pradesh",
      postalCode: "208001",
      isDefault: false,
    },
  ],
};

export const mockProviderUser = {
  id: "user_provider_1",
  name: "MuhammadBaqir",
  email: "baqir.muha@gmail.com",
  phone: "+919999888877",
  profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  role: "provider" as const,
  createdAt: "2023-03-20T08:00:00Z",
};
