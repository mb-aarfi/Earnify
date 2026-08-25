"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useCustomerProfile, useUpdateCustomerProfile } from "@/hooks/use-misc";
import { clearSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/shared/loading-skeleton";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CustomerProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useCustomerProfile();
  const updateProfile = useUpdateCustomerProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? { name: profile.name, email: profile.email, phone: profile.phone }
      : undefined,
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync(data);
  };

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  if (isLoading) return <Skeleton className="h-96 w-full max-w-2xl mx-auto" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
              {profile?.profileImage && (
                <Image src={profile.profileImage} alt={profile.name} fill className="object-cover" sizes="80px" />
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">{profile?.name}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" className="mt-1" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="mt-1" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" className="mt-1" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
            </div>
            <Button type="submit" loading={updateProfile.isPending}>Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile?.addresses.map((addr) => (
            <div key={addr.id} className="p-3 rounded-lg border text-sm">
              <p className="font-medium">{addr.label} {addr.isDefault && <span className="text-primary text-xs">(Default)</span>}</p>
              <p className="text-muted-foreground">{addr.line1}, {addr.city}, {addr.state} — {addr.postalCode}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <Button variant="destructive" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
