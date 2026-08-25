"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#for-providers", label: "For Providers" },
  { href: "/#about", label: "About" },
];

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          Earnify
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className={cn("md:hidden border-t", open ? "block" : "hidden")}>
        <nav className="container mx-auto px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Button variant="outline" asChild>
              <Link href="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t bg-brand-light-gray">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-primary">
              Earnify
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Find trusted professionals. Get things done.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/#about" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/#about" className="hover:text-foreground">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Customers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/customer/search" className="hover:text-foreground">Find Services</Link></li>
              <li><Link href="/customer/bookings" className="hover:text-foreground">Bookings</Link></li>
              <li><Link href="/#about" className="hover:text-foreground">Help</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Providers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth" className="hover:text-foreground">Become a Provider</Link></li>
              <li><Link href="/provider" className="hover:text-foreground">Provider Dashboard</Link></li>
              <li><Link href="/#about" className="hover:text-foreground">Help</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex gap-4">
            <Link href="/#about" className="hover:text-foreground">Privacy</Link>
            <Link href="/#about" className="hover:text-foreground">Terms</Link>
          </div>
          <p>© 2026 Earnify</p>
        </div>
      </div>
    </footer>
  );
}
