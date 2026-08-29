"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  MapPin,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

import {
  getDefaultUserId,
  setSession,
} from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type UserRole = "customer" | "provider";
type LocationStatus = "idle" | "granted" | "denied";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface MockSessionData {
  userId: string;
  role: UserRole;
  name: string;
  phone: string;
  locationAccess: boolean;
  location?: LocationData;
}

/**
 * Frontend-only mock OTP generator.
 *
 * IMPORTANT:
 * In production, OTP generation must happen on the backend.
 * This function exists only until the real authentication API is connected.
 */
function generateMockOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Normalize mobile number before using it.
 */
function normalizeMobileNumber(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Validate user details before sending/verifying OTP.
 */
function validateUserDetails(
  name: string,
  mobile: string
): string | null {
  const trimmedName = name.trim();
  const normalizedMobile = normalizeMobileNumber(mobile);

  if (!trimmedName) {
    return "Please enter your name.";
  }

  if (trimmedName.length < 2) {
    return "Please enter a valid name.";
  }

  if (!/^\d{10,15}$/.test(normalizedMobile)) {
    return "Please enter a valid mobile number.";
  }

  return null;
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole: UserRole =
    searchParams.get("role") === "provider"
      ? "provider"
      : "customer";

  const [selectedRole, setSelectedRole] =
    useState<UserRole>(initialRole);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("idle");

  const [locationMessage, setLocationMessage] = useState("");
  const [locationData, setLocationData] =
    useState<LocationData | null>(null);

  const [error, setError] = useState("");

  const roleLabel =
    selectedRole === "customer"
      ? "Customer"
      : "Service Provider";

  /**
   * Validate details shared by both OTP actions.
   */
  const validateDetails = (): boolean => {
    const validationError = validateUserDetails(name, mobile);

    if (validationError) {
      setError(validationError);
      return false;
    }

    setError("");
    return true;
  };

  /**
   * Send mock OTP.
   *
   * Replace the implementation inside this function
   * with the real backend API later.
   */
  const handleSendOtp = async () => {
    if (isSendingOtp) return;

    if (!validateDetails()) return;

    setIsSendingOtp(true);
    setError("");

    try {
      /*
       * TODO:
       * Replace this mock implementation with:
       *
       * await fetch("/api/auth/send-otp", {
       *   method: "POST",
       *   body: JSON.stringify({
       *     mobile: normalizeMobileNumber(mobile),
       *   }),
       * });
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const mockOtp = generateMockOtp();

      setGeneratedOtp(mockOtp);
      setOtp("");
      setOtpSent(true);
    } catch {
      setError(
        "Unable to send OTP. Please try again."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  /**
   * Request browser location permission.
   */
  const handleLocationAccess = () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      setLocationStatus("denied");
      setLocationMessage(
        "Location access is not supported on this browser."
      );
      return;
    }

    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } =
          position.coords;

        const location: LocationData = {
          latitude,
          longitude,
          accuracy,
        };

        setLocationData(location);
        setLocationStatus("granted");
        setLocationMessage(
          "Location access enabled."
        );
      },
      (error) => {
        setLocationData(null);
        setLocationStatus("denied");

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationMessage(
              "Location access was denied. You can enable it later."
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationMessage(
              "Your location is currently unavailable."
            );
            break;

          case error.TIMEOUT:
            setLocationMessage(
              "Location request timed out. Please try again."
            );
            break;

          default:
            setLocationMessage(
              "Unable to access your location."
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /**
   * Verify OTP and continue.
   *
   * This is currently a mock implementation.
   * The real OTP verification must happen on the backend.
   */
  const handleContinue = async () => {
    if (isVerifyingOtp) return;

    if (!validateDetails()) return;

    if (!otpSent) {
      setError("Please request an OTP first.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    setError("");

    try {
      /*
       * TODO:
       * Replace this mock verification with:
       *
       * const response = await fetch("/api/auth/verify-otp", {
       *   method: "POST",
       *   body: JSON.stringify({
       *     mobile: normalizeMobileNumber(mobile),
       *     otp,
       *     role: selectedRole,
       *   }),
       * });
       *
       * Backend should verify the OTP and create
       * the authenticated session.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      if (otp !== generatedOtp) {
        setError(
          "Incorrect OTP. Please check the OTP and try again."
        );
        return;
      }

      const sessionData: MockSessionData = {
        userId: getDefaultUserId(selectedRole),
        role: selectedRole,
        name: name.trim(),
        phone: normalizeMobileNumber(mobile),
        locationAccess:
          locationStatus === "granted",
        location: locationData ?? undefined,
      };

      /*
       * Temporary frontend session.
       *
       * When backend authentication is integrated,
       * this should be replaced by the real authenticated
       * session returned by the backend.
       */
      setSession(sessionData);

      router.push(
        selectedRole === "customer"
          ? "/customer"
          : "/provider"
      );
    } catch {
      setError(
        "Something went wrong while verifying the OTP."
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light-gray px-4 py-12">
      <Link
        href="/"
        className="text-2xl font-bold text-primary mb-8"
      >
        Earnify
      </Link>

      <div className="w-full max-w-xl">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Create your account
              </h1>

              <p className="text-sm text-muted-foreground">
                Continue as {roleLabel}. Additional profile
                details can be added later.
              </p>
            </div>

            {/* Role Selection */}
            <div
              className="grid sm:grid-cols-2 gap-3 mb-6"
              role="group"
              aria-label="Select account type"
            >
              <button
                type="button"
                aria-pressed={
                  selectedRole === "customer"
                }
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  selectedRole === "customer"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background hover:border-primary/50"
                }`}
                onClick={() => {
                  setSelectedRole("customer");
                  setError("");
                }}
              >
                <Users className="h-4 w-4" />
                Customer
              </button>

              <button
                type="button"
                aria-pressed={
                  selectedRole === "provider"
                }
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  selectedRole === "provider"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background hover:border-primary/50"
                }`}
                onClick={() => {
                  setSelectedRole("provider");
                  setError("");
                }}
              >
                <Briefcase className="h-4 w-4" />
                Provider
              </button>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium"
                >
                  Name
                </label>

                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isSendingOtp || isVerifyingOtp}
                />
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile"
                  className="mb-1 block text-sm font-medium"
                >
                  Mobile no
                </label>

                <div className="flex gap-2">
                  <div
                    className="flex items-center gap-2 rounded-md border bg-background px-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    <Smartphone className="h-4 w-4" />
                    +91
                  </div>

                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(/\D/g, "");

                      setMobile(value.slice(0, 10));
                      setError("");
                    }}
                    placeholder="Enter mobile number"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    disabled={
                      isSendingOtp || isVerifyingOtp
                    }
                  />
                </div>
              </div>

              {/* Send OTP */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={
                    isSendingOtp || isVerifyingOtp
                  }
                >
                  {isSendingOtp
                    ? "Sending OTP..."
                    : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
                </Button>

                {/* Demo OTP */}
                {otpSent && generatedOtp && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Demo OTP:{" "}
                    <span className="font-semibold text-foreground">
                      {generatedOtp}
                    </span>
                  </p>
                )}
              </div>

              {/* OTP */}
              {otpSent && (
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-1 block text-sm font-medium"
                  >
                    Enter OTP
                  </label>

                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                      setOtp(value);
                      setError("");
                    }}
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    disabled={isVerifyingOtp}
                  />

                  <p className="mt-2 text-xs text-muted-foreground">
                    Enter the 6-digit OTP sent to your
                    mobile number.
                  </p>
                </div>
              )}

              {/* Location */}
              <div className="rounded-xl border bg-accent/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Access your location
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleLocationAccess}
                    disabled={
                      locationStatus === "granted"
                    }
                  >
                    {locationStatus === "granted"
                      ? "Enabled"
                      : "Allow access"}
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

              {/* Error */}
              {error && (
                <p
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Continue */}
              <Button
                type="button"
                className="w-full"
                onClick={handleContinue}
                disabled={
                  isVerifyingOtp ||
                  isSendingOtp ||
                  !otpSent
                }
              >
                {isVerifyingOtp
                  ? "Verifying..."
                  : "Continue"}
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}