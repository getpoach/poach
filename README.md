# 🍽️ Poach — Private Chef Booking Platform

Book world-class chefs to cook in your home. Poach connects local professional chefs with people who want a private dining experience.

## Features

- 🔍 **Chef Discovery** — Search and filter chefs by cuisine, location, and availability
- 🗺️ **Map View** — See chefs plotted near you on an interactive map
- 👨‍🍳 **Chef Profiles** — Full profiles with bio, specialties, availability, and reviews
- 📅 **Booking Flow** — 3-step booking with date/time, guest details, and payment
- 💳 **Payments** — Secure card entry with booking summary
- 📋 **My Bookings** — Dashboard for upcoming and past sessions
- ⭐ **Reviews** — Leave and read reviews per chef
- 🚀 **Chef Onboarding** — Multi-step form for chefs to list their profile

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Discover page (home)
│   ├── bookings/         # My Bookings dashboard
│   ├── join/             # Chef onboarding
│   └── chefs/[id]/       # Individual chef profile
├── components/
│   ├── nav/              # Navbar
│   ├── chefs/            # ChefCard, ChefDrawer, ChefMap
│   ├── booking/          # BookingModal + step components
│   ├── reviews/          # ReviewModal
│   └── ui/               # Button, Input, Modal, Avatar, Tag
├── data/                 # Static chef + review data
├── hooks/                # useBookings, useChefFilter
├── types/                # TypeScript interfaces
└── lib/                  # Utility functions
```

## Roadmap

- [ ] Supabase database (chefs, bookings, reviews tables)
- [ ] Clerk authentication (guest + chef roles)
- [ ] Stripe payments
- [ ] Chef notification emails (Resend)
- [ ] Real map (Mapbox or Google Maps)
- [ ] Chef dashboard (manage bookings, set availability)
- [ ] Admin panel

## Environment Variables

When you add a backend, create a `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```
