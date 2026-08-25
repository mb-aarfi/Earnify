import type { ServiceCategory } from "@/types/provider";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "cat_plumber",
    name: "Plumber",
    slug: "plumber",
    description: "Pipe repairs, leak fixes, and bathroom fittings",
    icon: "Wrench",
  },
  {
    id: "cat_electrician",
    name: "Electrician",
    slug: "electrician",
    description: "Wiring, switch repairs, and electrical installations",
    icon: "Zap",
  },
  {
    id: "cat_mechanic",
    name: "Mechanic",
    slug: "mechanic",
    description: "Vehicle repairs, servicing, and breakdown assistance",
    icon: "Car",
  },
  {
    id: "cat_teacher",
    name: "Teacher",
    slug: "teacher",
    description: "Home tutoring and academic coaching",
    icon: "GraduationCap",
  },
  {
    id: "cat_developer",
    name: "Developer",
    slug: "developer",
    description: "Web, mobile, and software development services",
    icon: "Code",
  },
  {
    id: "cat_ac_repair",
    name: "AC Repair",
    slug: "ac-repair",
    description: "AC installation, servicing, and gas refilling",
    icon: "Wind",
  },
  {
    id: "cat_carpenter",
    name: "Carpenter",
    slug: "carpenter",
    description: "Furniture repair, custom woodwork, and fittings",
    icon: "Hammer",
  },
  {
    id: "cat_painter",
    name: "Painter",
    slug: "painter",
    description: "Interior and exterior painting services",
    icon: "Paintbrush",
  },
  {
    id: "cat_cleaner",
    name: "Cleaner",
    slug: "cleaner",
    description: "Home deep cleaning and sanitization",
    icon: "Sparkles",
  },
  {
    id: "cat_designer",
    name: "Designer",
    slug: "designer",
    description: "Graphic design, UI/UX, and branding services",
    icon: "Palette",
  },
];

export const popularServiceSlugs = [
  "plumber",
  "electrician",
  "mechanic",
  "teacher",
  "developer",
  "ac-repair",
  "carpenter",
  "painter",
  "cleaner",
  "designer",
];
