import { CustomerHeader, CustomerBottomNav } from "@/components/navigation/customer-nav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-8">{children}</main>
      <CustomerBottomNav />
    </div>
  );
}
