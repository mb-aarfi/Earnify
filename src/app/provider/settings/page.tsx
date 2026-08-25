"use client";

import { useRouter } from "next/navigation";
import { LogOut, Bell, Shield } from "lucide-react";
import { clearSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ProviderSettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="booking-notif">Booking requests</Label>
            <Switch id="booking-notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="review-notif">New reviews</Label>
            <Switch id="review-notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="promo-notif">Promotional updates</Label>
            <Switch id="promo-notif" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Authentication and security settings will be available when backend integration is complete.</p>
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
