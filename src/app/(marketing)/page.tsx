"use client";

import Link from "next/link";
import {
  Wrench,
  Zap,
  Car,
  GraduationCap,
  Code,
  Wind,
  Hammer,
  Paintbrush,
  Sparkles,
  Palette,
  Search,
  Users,
  Calendar,
  CheckCircle,
  Shield,
  MapPin,
  IndianRupee,
  Phone,
  Clock,
} from "lucide-react";
import { MarketingNavbar, MarketingFooter } from "@/components/layout/marketing-layout";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Zap,
  Car,
  GraduationCap,
  Code,
  Wind,
  Hammer,
  Paintbrush,
  Sparkles,
  Palette,
};

const services = [
  { name: "Plumber", icon: "Wrench", description: "Pipe repairs, leak fixes, and bathroom fittings" },
  { name: "Electrician", icon: "Zap", description: "Wiring, switch repairs, and installations" },
  { name: "Mechanic", icon: "Car", description: "Vehicle repairs and breakdown assistance" },
  { name: "Teacher", icon: "GraduationCap", description: "Home tutoring and academic coaching" },
  { name: "Developer", icon: "Code", description: "Web, mobile, and software development" },
  { name: "AC Repair", icon: "Wind", description: "AC installation, servicing, and repair" },
  { name: "Carpenter", icon: "Hammer", description: "Furniture repair and custom woodwork" },
  { name: "Painter", icon: "Paintbrush", description: "Interior and exterior painting" },
  { name: "Cleaner", icon: "Sparkles", description: "Home deep cleaning and sanitization" },
  { name: "Designer", icon: "Palette", description: "Graphic design and branding services" },
];

const steps = [
  { num: "01", title: "Search a service", description: "Find the service you need from our wide range of categories", icon: Search },
  { num: "02", title: "Compare professionals", description: "Browse profiles, ratings, and reviews to find the best match", icon: Users },
  { num: "03", title: "Book a professional", description: "Choose a convenient time and confirm your booking instantly", icon: Calendar },
  { num: "04", title: "Get the job done", description: "Sit back while trusted professionals complete your work", icon: CheckCircle },
];

const benefits = [
  { icon: Shield, title: "Trusted professionals", description: "All providers are verified and background-checked" },
  { icon: MapPin, title: "Nearby service providers", description: "Find skilled professionals in your locality" },
  { icon: IndianRupee, title: "Transparent pricing", description: "Clear upfront pricing with no hidden charges" },
  { icon: Calendar, title: "Easy booking", description: "Book services in just a few taps" },
  { icon: Phone, title: "Direct contact", description: "Call or message providers directly" },
  { icon: Clock, title: "Convenient service", description: "Flexible scheduling that fits your life" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-black">
                Find the right professional for every job.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Connect with trusted local service providers and get your work done with confidence.
              </p>
              <div className="mt-8">
                <SearchBar showLocation className="max-w-xl" />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/auth">Find a Service</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth">Become a Service Provider</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-2xl bg-accent/80 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {services.slice(0, 4).map((s) => {
                    const Icon = iconMap[s.icon];
                    return (
                      <div key={s.name} className="bg-background rounded-xl p-4 shadow-sm text-center">
                        <Icon className="h-8 w-8 mx-auto text-primary mb-2" />
                        <p className="text-sm font-medium">{s.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How Earnify Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Getting professional help has never been easier. Follow these simple steps.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card key={step.num} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <span className="text-3xl font-bold text-primary/30">{step.num}</span>
                  <step.icon className="h-8 w-8 text-primary mt-4 mb-3" />
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section id="services" className="py-16 md:py-24 bg-brand-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Popular Services</h2>
            <p className="mt-4 text-muted-foreground">Browse our most requested service categories</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Link key={service.name} href={`/customer/search?q=${encodeURIComponent(service.name)}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mt-3">{service.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Earnify */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why Earnify?</h2>
            <p className="mt-4 text-muted-foreground">The smarter way to hire local professionals</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4 p-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Providers CTA */}
      <section id="for-providers" className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Turn your skills into income.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Join Earnify, showcase your services and connect with customers who need your expertise.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/auth">Become a Service Provider</Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
