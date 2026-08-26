"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Users, Briefcase } from "lucide-react";
import { setSession, getDefaultUserId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRole = searchParams.get("role") === "provider" ? "provider" : "customer";

  const handleRoleSelect = (role: "customer" | "provider") => {
    setSession({
      userId: getDefaultUserId(role),
      role,
    });
    router.push(role === "customer" ? "/customer" : "/provider");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light-gray px-4 py-12">
      <Link href="/" className="text-2xl font-bold text-primary mb-8">
        Earnify
      </Link>

      <div className="w-full max-w-2xl text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          How do you want to use Earnify?
        </h1>
        <p className="text-muted-foreground mb-8">
          Choose your role to get started. You can switch later.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow border-2 ${
              selectedRole === "customer" ? "border-primary shadow-md" : "border-transparent hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelect("customer")}
          >
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Customer</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Find trusted professionals near you.
              </p>
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); handleRoleSelect("customer"); }}>
                Continue as Customer
              </Button>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow border-2 ${
              selectedRole === "provider" ? "border-primary shadow-md" : "border-transparent hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelect("provider")}
          >
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Service Provider</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Offer your services and grow your business.
              </p>
              <Button className="w-full" onClick={(e) => { e.stopPropagation(); handleRoleSelect("provider"); }}>
                Continue as Provider
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
