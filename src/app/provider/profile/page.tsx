"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useProviderProfile, useUpdateProviderProfile } from "@/hooks/use-misc";
import { useServiceCategories } from "@/hooks/use-providers";
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
import { Skeleton } from "@/components/shared/loading-skeleton";
import { RatingStars } from "@/components/reviews/rating-stars";
import { VerificationBadge } from "@/components/providers/verification-badge";

const profileSchema = z.object({
  name: z.string().min(2),
  businessName: z.string().optional(),
  bio: z.string().min(20),
  phone: z.string().min(10),
  email: z.string().email(),
  serviceRadiusKm: z.coerce.number().min(1).max(50),
  languages: z.string(),
  categoryId: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProviderProfilePage() {
  const { data: profile, isLoading } = useProviderProfile();
  const { data: categories } = useServiceCategories();
  const updateProfile = useUpdateProviderProfile();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          name: profile.name,
          businessName: profile.businessName ?? "",
          bio: profile.bio,
          phone: profile.phone,
          email: profile.email,
          serviceRadiusKm: profile.serviceRadiusKm,
          languages: profile.languages.join(", "),
          categoryId: profile.categoryId,
        }
      : undefined,
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync({
      ...data,
      languages: data.languages.split(",").map((l) => l.trim()),
    });
  };

  if (isLoading || !profile) return <Skeleton className="h-96 w-full max-w-2xl" />;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
              {profile.profileImage && (
                <Image src={profile.profileImage} alt={profile.name} fill className="object-cover" sizes="80px" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">{profile.name}</p>
                <VerificationBadge verified={profile.verified} />
              </div>
              <p className="text-sm text-muted-foreground">{profile.categoryName}</p>
              <RatingStars rating={profile.rating} showValue className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input className="mt-1" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Business Name</Label>
              <Input className="mt-1" {...register("businessName")} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={watch("categoryId")} onValueChange={(v) => setValue("categoryId", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>About</Label>
              <Textarea className="mt-1" rows={4} {...register("bio")} />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input className="mt-1" {...register("phone")} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-1" {...register("email")} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Service Radius (km)</Label>
                <Input type="number" className="mt-1" {...register("serviceRadiusKm")} />
              </div>
              <div>
                <Label>Languages (comma separated)</Label>
                <Input className="mt-1" {...register("languages")} />
              </div>
            </div>
            <Button type="submit" loading={updateProfile.isPending}>Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
