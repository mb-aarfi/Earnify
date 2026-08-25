"use client";

import { use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useProvider } from "@/hooks/use-providers";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useCustomerProfile, useAvailableTimeSlots } from "@/hooks/use-misc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceDisplay } from "@/components/shared/price-display";
import { formatDate, formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/shared/loading-skeleton";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time slot"),
  addressId: z.string().min(1, "Please select an address"),
  description: z.string().min(10, "Please describe what you need (min 10 characters)"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookProviderPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");

  const { data: provider, isLoading } = useProvider(providerId);
  const { data: profile } = useCustomerProfile();
  const createBooking = useCreateBooking();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: preselectedService ?? "",
      date: "",
      time: "",
      addressId: profile?.addresses.find((a) => a.isDefault)?.id ?? "",
      description: "",
    },
  });

  const selectedDate = watch("date");
  const selectedServiceId = watch("serviceId");
  const selectedService = provider?.services.find((s) => s.id === selectedServiceId);
  const selectedAddress = profile?.addresses.find((a) => a.id === watch("addressId"));

  const { data: timeSlots } = useAvailableTimeSlots(selectedDate, providerId);

  useEffect(() => {
    if (preselectedService) setValue("serviceId", preselectedService);
    const defaultAddr = profile?.addresses.find((a) => a.isDefault);
    if (defaultAddr) setValue("addressId", defaultAddr.id);
  }, [preselectedService, profile, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    const result = await createBooking.mutateAsync({
      ...data,
      providerId,
    });
    router.push(`/customer/bookings/${result.id}`);
  };

  if (isLoading || !provider) {
    return <Skeleton className="h-96 w-full max-w-2xl mx-auto" />;
  }

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/customer/providers/${providerId}`} className="text-sm text-primary hover:underline">
          ← Back to profile
        </Link>
        <h1 className="text-2xl font-bold mt-2">Book {provider.name}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Service */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Service</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={watch("serviceId")} onValueChange={(v) => setValue("serviceId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {provider.services.filter((s) => s.active).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — ₹{s.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceId && <p className="text-sm text-destructive mt-1">{errors.serviceId.message}</p>}
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" min={minDate} className="mt-1" {...register("date")} />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
            </div>
            {selectedDate && timeSlots && (
              <div>
                <Label>Time Slot</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={watch("time") === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setValue("time", slot)}
                    >
                      {formatTime(slot)}
                    </Button>
                  ))}
                </div>
                {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Address</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={watch("addressId")} onValueChange={(v) => setValue("addressId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select address" />
              </SelectTrigger>
              <SelectContent>
                {profile?.addresses.map((addr) => (
                  <SelectItem key={addr.id} value={addr.id}>
                    {addr.label}: {addr.line1}, {addr.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.addressId && <p className="text-sm text-destructive mt-1">{errors.addressId.message}</p>}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What do you need help with?</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the issue or service required..."
              rows={4}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-accent/30">
          <CardHeader>
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{provider.name}</span>
            </div>
            {selectedService && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span>{selectedService.name}</span>
              </div>
            )}
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{formatDate(selectedDate)}</span>
              </div>
            )}
            {watch("time") && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{formatTime(watch("time"))}</span>
              </div>
            )}
            {selectedAddress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="text-right max-w-[60%]">{selectedAddress.line1}, {selectedAddress.city}</span>
              </div>
            )}
            {selectedService && (
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Estimated Price</span>
                <PriceDisplay amount={selectedService.price} prefix="" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="sticky bottom-20 md:bottom-4 bg-background pt-4 pb-2">
          <Button type="submit" size="lg" className="w-full" loading={createBooking.isPending}>
            Confirm Booking
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Payment integration coming soon
          </p>
        </div>
      </form>
    </div>
  );
}
