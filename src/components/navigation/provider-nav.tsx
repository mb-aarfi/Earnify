"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Clock,
  DollarSign,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/provider", label: "Dashboard", icon: LayoutDashboard },
  { href: "/provider/bookings", label: "Bookings", icon: Calendar },
  { href: "/provider/services", label: "Services", icon: Wrench },
  { href: "/provider/availability", label: "Availability", icon: Clock },
  { href: "/provider/earnings", label: "Earnings", icon: DollarSign },
  { href: "/provider/profile", label: "Profile", icon: User },
  { href: "/provider/settings", label: "Settings", icon: Settings },
];

const mobileNavItems = sidebarItems.slice(0, 4);

export function ProviderSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-background">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/provider" className="text-xl font-bold text-primary">
            Earnify
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/provider" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="lg:hidden sticky top-0 z-40 border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/provider" className="text-lg font-bold text-primary">
            Earnify
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {mobileOpen && (
          <nav className="border-t p-2 space-y-1">
            {sidebarItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden safe-bottom">
        <div className="flex items-center justify-around h-16">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/provider" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2 text-xs",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
