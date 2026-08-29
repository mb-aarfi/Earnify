"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Users, Briefcase, MapPin, Smartphone, CheckCircle2 } from "lucide-react";
import { setSession, getDefaultUserId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "provider" ? "provider" : "customer";

  const [selectedRole, setSelectedRole] = useState<"customer" | "provider">(initialRole);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("123456");
  const [locationStatus, setLocationStatus] = useState<"idle" | "granted" | "denied">("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [error, setError] = useState("");

  const roleLabel = useMemo(
    () => (selectedRole === "customer" ? "Customer" : "Service Provider"),
    [selectedRole]
  );

  const handleSendOtp = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!/^\d{10,15}$/.test(mobile.replace(/\s+/g, ""))) {
      setError("Please enter a valid mobile number.");
      return;
    }

    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setOtp("");
    setError("");
  };

  const handleLocationAccess = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationStatus("denied");
      setLocationMessage("Location access is not supported on this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationStatus("granted");
        setLocationMessage("Location access enabled.");
      },
      () => {
        setLocationStatus("denied");
        setLocationMessage("Location access denied. You can continue, and this can be enabled later.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleContinue = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!/^\d{10,15}$/.test(mobile.replace(/\s+/g, ""))) {
      setError("A valid mobile number is required.");
      return;
    }

    if (!otpSent || otp !== generatedOtp) {
      setError("Please verify the OTP before continuing.");
      return;
    }

    setSession({
      userId: getDefaultUserId(selectedRole),
      role: selectedRole,
      name: name.trim(),
      phone: mobile.trim(),
      locationAccess: locationStatus === "granted",
    });

    router.push(selectedRole === "customer" ? "/customer" : "/provider");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light-gray px-4 py-12">
      <Link href="/" className="text-2xl font-bold text-primary mb-8">
        Earnify
      </Link>

      <div className="w-full max-w-xl">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-sm text-muted-foreground">
                Continue as {roleLabel}. Additional profile details can be added later.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  selectedRole === "customer"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole("customer")}
              >
                <Users className="h-4 w-4" />
                Customer
              </button>

              <button
                type="button"
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  selectedRole === "provider"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole("provider")}
              >
                <Briefcase className="h-4 w-4" />
                Provider
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Mobile no</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    +
                  </div>
                  <Input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div>
                <Button type="button" variant="outline" className="w-full" onClick={handleSendOtp}>
                  Send OTP
                </Button>
                {otpSent && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Demo OTP: <span className="font-semibold text-foreground">{generatedOtp}</span>
                  </p>
                )}
              </div>

              {otpSent && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Enter OTP</label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                  />
                </div>
              )}

              <div className="rounded-xl border bg-accent/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Access your location
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={handleLocationAccess}>
                    Allow access
                  </Button>
                </div>
                {locationMessage && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {locationStatus === "granted" ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {locationMessage}
                      </span>
                    ) : (
                      locationMessage
                    )}
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="button" className="w-full" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
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
