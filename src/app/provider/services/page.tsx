"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useProviderServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/use-services";
import { useServiceCategories } from "@/hooks/use-providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/price-display";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { Service } from "@/types/provider";

const serviceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description required"),
  price: z.coerce.number().min(1, "Price required"),
  durationMinutes: z.coerce.number().min(15),
  durationLabel: z.string().min(1, "Duration label required"),
  active: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

function ServiceForm({
  defaultValues,
  onSubmit,
  loading,
}: {
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  loading?: boolean;
}) {
  const { data: categories } = useServiceCategories();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      active: true,
      durationMinutes: 60,
      durationLabel: "1 hour",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Service Name</Label>
        <Input className="mt-1" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div>
        <Label>Category</Label>
        <Select value={watch("categoryId")} onValueChange={(v) => setValue("categoryId", v)}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
      </div>
      <div>
        <Label>Description</Label>
        <Textarea className="mt-1" {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price (₹)</Label>
          <Input type="number" className="mt-1" {...register("price")} />
        </div>
        <div>
          <Label>Duration Label</Label>
          <Input className="mt-1" placeholder="1 hour" {...register("durationLabel")} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={watch("active")} onCheckedChange={(v) => setValue("active", v)} />
        <Label>Active</Label>
      </div>
      <Button type="submit" className="w-full" loading={loading}>Save Service</Button>
    </form>
  );
}

export default function ProviderServicesPage() {
  const { data: services, isLoading } = useProviderServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const [addOpen, setAddOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
            <ServiceForm
              onSubmit={async (data) => {
                await createService.mutateAsync(data);
                setAddOpen(false);
              }}
              loading={createService.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!services || services.length === 0 ? (
        <EmptyState title="No services yet" description="Add your first service to start receiving bookings." actionLabel="Add Service" onAction={() => setAddOpen(true)} />
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge variant={service.active ? "success" : "secondary"}>
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <PriceDisplay amount={service.price} prefix="" />
                      <span className="text-muted-foreground">{service.durationLabel}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editService?.id === service.id} onOpenChange={(o) => !o && setEditService(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditService(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Edit Service</DialogTitle></DialogHeader>
                        <ServiceForm
                          defaultValues={service}
                          onSubmit={async (data) => {
                            await updateService.mutateAsync({ id: service.id, data });
                            setEditService(null);
                          }}
                          loading={updateService.isPending}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateService.mutate({ id: service.id, data: { active: !service.active } })}
                    >
                      {service.active ? "Deactivate" : "Activate"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete service?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteService.mutate(service.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
