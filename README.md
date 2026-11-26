# GlycoPulse AI: Diabetes & Blood Pressure Management Platform

An AI-powered, production-grade clinical healthcare management web application built for continuous monitoring and management of Blood Pressure (BP), Blood Glucose (Sugar), Diabetes progression, Lifestyle & Indian Nutrition, Prescriptions, Doctor Consultations, and Secure Video Appointments.

---

## 🌟 Architecture & Technology Stack

- **Frontend Framework**: Next.js 16 (App Router, Server & Client Components) with React 19 & TypeScript.
- **Styling & UI**: Tailwind CSS, Lucide Icons, Clean Modern Healthcare SaaS Theme (Apple Health / Practo inspired).
- **Clinical Telemetry Charts**: Recharts for dual BP trends (systolic/diastolic) and isolated glycemic curves.
- **Reporting & Export**: jsPDF and jsPDF-AutoTable for automated clinical PDF generation and CSV exports.
- **Backend & Database**: Next.js API Routes, Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) policies.
- **AI Health Assistant**: OpenAI integration with strict clinical safety guardrails, emergency threshold alerts, and Indian diet planners.
- **Teleconsultation**: Encrypted WebRTC Video Consultation Rooms (via Jitsi Meet integration).
- **Deployment**: Vercel-ready with Git workflow.

---

## 🏥 Three Primary Role-Based Interfaces

### 1. Patient Panel
- **Health Dashboard**: Real-time summary cards for Today's BP, Latest Fasting Sugar, 2-hr Post-Meal Sugar, HbA1c, Active Medications, and Next Scheduled Doctor Consultation.
- **Blood Pressure Tracker**:
  - Log Systolic, Diastolic, Pulse, Position (Sitting/Lying/Standing), and context notes.
  - Automatic clinical classification (Normal, Elevated, Stage 1/2 Hypertension, Hypertensive Crisis).
  - Chronological trend charts.
  - One-click PDF clinical report generation & CSV export.
- **Blood Sugar Tracker**:
  - Independent tracking of Fasting, Pre-Meal, 1-hr / 2-hr Post-Meal, Random, and Bedtime readings.
  - **Clinical Rule Followed**: Fasting and post-meal readings are never merged into a misleading single average.
  - Unit toggle and accurate conversion between `mg/dL` and `mmol/L`.
  - PDF & CSV clinical data exports.
- **AI Health Assistant**:
  - Context-aware clinical guidance based on the patient's actual vitals and medications.
  - **Safety Guardrails**: Never diagnoses diseases or prescribes/adjusts drugs; triggers immediate emergency warnings on critical vitals (Systolic ≥180, Diastolic ≥120, Sugar <70 or ≥300 mg/dL).
- **7-Day Indian Diet Planner**:
  - Comprehensive 7-day meal schedule incorporating millets (ragi, bajra, jowar), dals, high-fiber vegetables, and portion control for glycemic balance.
  - Downloadable 7-day diet PDF.
- **Medication Management**: Daily morning, evening, and bedtime dosage schedules, reminders, and adherence logs.
- **Doctor Directory & Booking**: Filter by specialty (Diabetologist, Cardiologist, Physician, Nutritionist), view verified credentials, book video or in-clinic slots.
- **Encrypted Video Consultation**: In-browser video room with live telemetry reference for the doctor.
- **Medical Records Vault**: Secure repository for diagnostic lab reports, HbA1c test documents, and digital prescriptions with granular consent sharing.
- **Patient Profile**: Demographics, targets, and emergency contacts.

---

### 2. Doctor Panel
- **Doctor Dashboard**: Today's appointment roster, patient health alert counts, and verified registration details.
- **Authorized Patients**: Access longitudinal BP and glucose telemetry strictly for patients who have granted consent.
- **Digital Prescriptions**:
  - Formally create, edit, and digitally sign multi-item prescriptions.
  - AI is strictly prohibited from creating or finalizing prescriptions.
  - Instant generation of printable/downloadable PDF prescriptions.
- **Medical Consultation Reports**:
  - Create consultation reports capturing Chief Complaints, Clinical Observations, Observed Vitals, Formal Diagnosis, Treatment Plan, and Follow-Up dates.
  - One-click clinical PDF download.
- **Appointment Management**: Manage consultation schedule, approve or complete sessions, and launch private video rooms.
- **Doctor Profile**: Manage qualifications, MCI registration numbers, hospital affiliations, and consultation fees.

---

### 3. Admin Panel
- **Administrative Governance Console**: System metrics, verified doctors, active patients, and AI safety incident logs.
- **Doctor Credential Verification**: Review medical registration numbers and approve/reject practitioners before they appear in the public booking directory.
- **Patient Management**: Audit patient accounts and toggle account status.
- **Audit Logs**: Immutable event log tracking patient health record views, prescription signings, and credential modifications in compliance with data protection standards.
- **AI Engine Safety & Config**: Configure model providers, temperature, and hard clinical emergency thresholds.

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup (Supabase PostgreSQL)
1. Log into your [Supabase Console](https://supabase.com).
2. Create a new PostgreSQL project.
3. Open the **SQL Editor** tab.
4. Paste and execute the contents of `supabase/schema.sql`.
5. (Optional for development) Run `supabase/seed.sql` to populate sample data.

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build Verification
The application has been verified with Next.js 16 (Turbopack) production compiler:
```bash
npm run build
```
Result: `✓ Generating static pages (28/28) in 7.3s. Compiled successfully.`

---

## 🚢 Deployment to Vercel & GitHub

### Step 1: Initialize Git and Push to GitHub
```bash
git add .
git commit -m "feat: complete AI diabetes & BP management platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. In **Environment Variables**, paste the variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_JITSI_DOMAIN`
4. Click **Deploy**. Vercel will build and assign your production domain.

---

## 🔒 Healthcare Privacy & Safety Statement
- **AI Disclaimer**: GlycoPulse AI provides educational health insights and lifestyle suggestions; it does not replace the diagnosis, prescription, or clinical judgment of a licensed medical practitioner.
- **Prescription Sovereignty**: Only verified licensed doctors can authorize and finalize prescriptions.
- **Emergency Protocols**: Patients with critical readings (Systolic ≥180, Diastolic ≥120, Blood Sugar <70 or ≥300 mg/dL) are immediately directed to emergency medical care.
