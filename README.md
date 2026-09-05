# Futuristic EdTech Recorded Classes Platform (V1)

A production-grade, secure, cost-optimized recorded classes platform engineered for 100–150 students. 

Features a responsive cross-platform mobile & tablet application (iOS & Android) with a futuristic visual identity, alongside a full-featured administrative web dashboard.

---

## System Architecture

* **Mobile Application (`apps/student_app`)**: Flutter 3.x with Dart, Riverpod 2.x state management, responsive tablet/phone layouts, video player with resume functionality, offline detection, and pre-authorized phone OTP login.
* **Admin Dashboard (`apps/admin_dashboard`)**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide icons, role-protected admin routes, student management, course/lesson authoring, and subscription assignment.
* **Backend & Database (`backend/supabase`)**: PostgreSQL with strict Row Level Security (RLS), Supabase Auth with SMS OTP, and Supabase Edge Functions.
* **Video Delivery**: Cloudflare R2 private bucket with zero egress fees and time-limited presigned streaming URLs (15-minute TTL).

---

## Directory Structure

```
D:\mobileapp\
├── apps/
│   ├── student_app/         # Flutter Mobile & Tablet application
│   └── admin_dashboard/     # Next.js 15 TypeScript Admin Dashboard
├── backend/
│   └── supabase/
│       ├── migrations/      # PostgreSQL DDL, constraints, indexes & RLS
│       ├── functions/       # Edge Functions (check-student, get-playback-url)
│       └── seed.sql         # Seed data for development
├── shared/                  # Shared TypeScript/Dart data schemas & constants
├── docs/                    # Architecture diagrams & API documentation
├── .github/
│   └── workflows/           # CI/CD workflows for Flutter & Next.js
├── .env.example             # Environment configuration template
└── README.md
```

---

## Core Student Loop
```
LOGIN (Phone OTP) ➔ SEE MY COURSES ➔ CHOOSE COURSE ➔ CHOOSE LESSON ➔ WATCH VIDEO ➔ RESUME & TRACK PROGRESS
```

---

## Getting Started

### 1. Database & Backend Setup
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Execute the migrations in order:
   - `backend/supabase/migrations/20260905000001_initial_schema.sql`
   - `backend/supabase/migrations/20260905000002_rls_policies.sql`
3. Optional: Run `backend/supabase/seed.sql` for test data.
4. Deploy the edge functions in `backend/supabase/functions/`.

### 2. Admin Dashboard (`apps/admin_dashboard`)
```bash
cd apps/admin_dashboard
npm install
npm run dev
```
Open `http://localhost:3000`.

### 3. Student Mobile App (`apps/student_app`)
```bash
cd apps/student_app
flutter pub get
flutter run
```
