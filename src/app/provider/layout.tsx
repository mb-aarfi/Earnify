import { ProviderSidebar } from "@/components/navigation/provider-nav";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <ProviderSidebar />
      <main className="lg:pl-64 pb-20 lg:pb-8">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
