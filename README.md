# Sankalp Interior Solution HRMS

Enterprise HRMS + Field Operations platform for Sankalp Group & Business Solution.

## Features

- **Attendance Management**: Punch IN/OUT with front-camera selfie and GPS verification.
- **Financial Ledger (Khata)**: Track employee advances and deductions digitally.
- **Payroll System**: Automated monthly salary calculation based on attendance and ledger adjustments.
- **PDF Salary Slips**: Generate professional salary slips with one click.
- **Project Site Management**: Track multiple project sites and employee assignments.
- **Employee Directory**: Manage staff and laborers with role-based details.
- **Authentication**: Secure login with Email/Password and Google OAuth.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Vercel Serverless Functions (Node.js).
- **Database**: Supabase (PostgreSQL) with PostGIS for geo-queries.
- **Auth**: Supabase Auth.

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env` file with the following:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Database Setup**:
   Run the provided SQL script in your Supabase SQL Editor to create tables and seed data.
5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Deployment

The project is configured for deployment on **Vercel**. Simply connect your GitHub repository to Vercel and it will handle the rest.

---
"ঘর নয়, স্বপ্ন সাজাই আমরা"
