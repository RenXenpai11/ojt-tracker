# OJT Tracker

OJT Tracker is a web application for students to record daily internship activity, monitor rendered hours, and track progress toward required training hours.

It includes authentication, onboarding/setup, time in/time out logging, progress analytics, and profile management in a responsive dashboard UI.

## Features

- Secure authentication with Supabase (register, login, forgot/reset password)
- Guided setup flow before dashboard access
- Time in and time out workflow with daily notes
- Manual daily log entry and log deletion
- Real-time progress metrics:
  - total rendered hours
  - remaining hours
  - average hours per day
  - percent complete
- Profile management (company, phone, location, course, avatar)
- Light and dark theme support

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS
- Supabase (Auth + Postgres)
- React Router
- Recharts
- Lucide React icons

## Project Structure

```text
src/
  app/
    components/     # Layout, header, sidebar, reusable UI
    context/        # Auth and OJT business state
    data/           # Static options (courses, schools)
    pages/          # Route pages
    store/          # Shared types and helper functions
  lib/
    supabase.ts     # Supabase client configuration
```

## Route Overview

- /welcome
- /login
- /register
- /forgot-password
- /reset-password
- /setup
- /
- /logs
- /profile

Protected routes are guarded so users must be authenticated, and setup must be completed before accessing the main application pages.

## Getting Started

### 1. Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env.local file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The app will throw an error at startup if these values are missing.

### 4. Configure Supabase

At minimum, your database should include:

- profiles table (user profile and OJT setup fields)
- ojt_logs table (daily rendered logs)

Also ensure email/password authentication is enabled in your Supabase Auth settings.

### 5. Start development server

```bash
npm run dev
```

Open the local URL shown in the terminal (typically http://localhost:5173).

## Available Scripts

- npm run dev: Start Vite development server
- npm run build: Type-check and create production build
- npm run preview: Preview production build locally
- npm run lint: Run ESLint checks

## Build and Deployment

This project is ready for deployment on Vercel (vercel.json is included).

Standard production build command:

```bash
npm run build
```

Before deploying, add these environment variables in your hosting provider settings:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Application State Design

- AuthContext manages:
  - Supabase session state
  - user identity
  - profile loading and updates
  - auth actions (login/register/logout/password reset)
- OJTContext manages:
  - current clock session
  - logs list and metrics
  - log create/delete actions
  - local persistence for active session state

## Notes

- This repository currently has no license file.
- If you plan to open source it, add a LICENSE and update this README accordingly.
