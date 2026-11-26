-- Supabase SQL Schema for AI-Powered Diabetes & Blood Pressure Management Platform
-- Run this migration in your Supabase SQL Editor.

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 1. ENUMS & DOMAINS
-- ==========================================================
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE glucose_type AS ENUM ('fasting', 'before_meal', 'post_meal_1h', 'post_meal_2h', 'random', 'bedtime');
CREATE TYPE glucose_unit AS ENUM ('mg_dL', 'mmol_L');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE consultation_type AS ENUM ('video', 'clinic');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ==========================================================
-- 2. CORE USERS & PROFILES
-- ==========================================================

-- Custom application users table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patient Profiles
CREATE TABLE IF NOT EXISTS public.patient_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender TEXT,
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    diabetes_type TEXT DEFAULT 'Unknown', -- Type 1, Type 2, Gestational, Other, Unknown
    existing_conditions TEXT[],
    allergies TEXT[],
    current_medications_summary TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    target_systolic_min INT DEFAULT 90,
    target_systolic_max INT DEFAULT 130,
    target_diastolic_min INT DEFAULT 60,
    target_diastolic_max INT DEFAULT 85,
    target_fasting_min NUMERIC(5, 1) DEFAULT 70.0,
    target_fasting_max NUMERIC(5, 1) DEFAULT 100.0,
    target_postmeal_max NUMERIC(5, 1) DEFAULT 140.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Doctor Profiles
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    qualifications TEXT NOT NULL,
    medical_registration_no TEXT NOT NULL UNIQUE,
    specialty TEXT NOT NULL,
    years_of_experience INT NOT NULL DEFAULT 0,
    hospital_clinic_name TEXT,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    languages_spoken TEXT[] DEFAULT ARRAY['English', 'Hindi'],
    bio TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- 3. CLINICAL HEALTH TRACKERS
-- ==========================================================

-- Blood Pressure Readings
CREATE TABLE IF NOT EXISTS public.bp_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    systolic INT NOT NULL,
    diastolic INT NOT NULL,
    pulse INT,
    measurement_position TEXT, -- sitting, lying, standing
    arm TEXT, -- left, right
    notes TEXT,
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blood Glucose Readings
CREATE TABLE IF NOT EXISTS public.glucose_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    glucose_value NUMERIC(6, 2) NOT NULL,
    unit glucose_unit NOT NULL DEFAULT 'mg_dL',
    measurement_type glucose_type NOT NULL DEFAULT 'random',
    meal_details TEXT,
    notes TEXT,
    is_critical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Weight & Lifestyle Records
CREATE TABLE IF NOT EXISTS public.lifestyle_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5, 2),
    bmi NUMERIC(4, 1),
    walking_steps INT DEFAULT 0,
    exercise_minutes INT DEFAULT 0,
    sleep_hours NUMERIC(3, 1),
    water_liters NUMERIC(3, 1),
    diet_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medications (Active schedules)
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    prescribed_by UUID REFERENCES public.doctor_profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL, -- e.g. 500mg
    frequency TEXT NOT NULL, -- Once daily, Twice daily, etc.
    timing TEXT[], -- Morning, Afternoon, Evening, Bedtime
    instructions TEXT, -- Before meal, After meal
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medication Adherence Logs
CREATE TABLE IF NOT EXISTS public.medication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMPTZ NOT NULL,
    taken_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending', -- taken, missed, skipped
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- 4. APPOINTMENTS & VIDEO CONSULTATIONS
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0 = Sunday, 1 = Monday ... 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    consultation_type consultation_type NOT NULL DEFAULT 'video',
    status appointment_status NOT NULL DEFAULT 'pending',
    chief_complaints TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    meeting_room_id TEXT UNIQUE,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Video Consultation Room Tracking
CREATE TABLE IF NOT EXISTS public.video_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    room_name TEXT NOT NULL UNIQUE,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    doctor_joined BOOLEAN DEFAULT FALSE,
    patient_joined BOOLEAN DEFAULT FALSE,
    consultation_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- 5. PRESCRIPTIONS & MEDICAL REPORTS
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    prescribed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    special_precautions TEXT,
    is_finalized BOOLEAN NOT NULL DEFAULT FALSE,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructions TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medical_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    consultation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    chief_complaints TEXT NOT NULL,
    clinical_observations TEXT,
    bp_recorded TEXT,
    glucose_recorded TEXT,
    diagnosis TEXT NOT NULL,
    treatment_plan TEXT NOT NULL,
    follow_up_date DATE,
    recommendations TEXT,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Uploaded Lab Reports and Documents
CREATE TABLE IF NOT EXISTS public.patient_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL, -- Lab Report, HbA1c, Prescription, Imaging, Other
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type TEXT,
    notes TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Doctor Access Consent
CREATE TABLE IF NOT EXISTS public.patient_doctor_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(patient_id, doctor_id)
);

-- ==========================================================
-- 6. AI CONVERSATIONS, INSIGHTS & DIET PLANS
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Health Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    is_emergency_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- bp_trend, glucose_trend, medication_risk, lifestyle
    severity TEXT NOT NULL DEFAULT 'info', -- info, caution, warning, emergency
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    recommendations TEXT[],
    is_reviewed_by_patient BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    plan_title TEXT NOT NULL,
    week_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    plan_json JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- 7. NOTIFICATIONS & AUDIT LOGS
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- appointment, medication, alert, report
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- view_patient_record, create_prescription, verify_doctor, etc.
    target_entity TEXT NOT NULL,
    target_id TEXT,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================================
-- 8. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_bp_patient_measured ON public.bp_readings(patient_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_glucose_patient_measured ON public.glucose_readings(patient_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_lifestyle_patient_date ON public.lifestyle_records(patient_id, recorded_date DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id, scheduled_start DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id, scheduled_start DESC);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON public.medications(patient_id, is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_logs(actor_id, created_at DESC);

-- ==========================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bp_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glucose_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_doctor_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read own profile or admin can read all; doctors can read their consented patients
CREATE POLICY "Profiles are viewable by owner or admin"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles updateable by owner"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Patient Profiles
CREATE POLICY "Patients view own profile"
ON public.patient_profiles FOR SELECT
USING (
  auth.uid() = id 
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.patient_doctor_consents
    WHERE patient_id = patient_profiles.id AND doctor_id = auth.uid() AND is_active = TRUE
  )
);

CREATE POLICY "Patients update own profile"
ON public.patient_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Patients insert own profile"
ON public.patient_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Doctor Profiles: Public can view verified doctors; doctors can edit own; admins can manage
CREATE POLICY "Public can view verified doctors"
ON public.doctor_profiles FOR SELECT
USING (verification_status = 'approved' OR auth.uid() = id OR public.is_admin());

CREATE POLICY "Doctors can update own profile"
ON public.doctor_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Doctors can insert own profile"
ON public.doctor_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- BP Readings: Patient owner, consented doctors, or admin
CREATE POLICY "BP Readings access policy"
ON public.bp_readings FOR SELECT
USING (
  patient_id = auth.uid() 
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.patient_doctor_consents
    WHERE patient_id = bp_readings.patient_id AND doctor_id = auth.uid() AND is_active = TRUE
  )
);

CREATE POLICY "BP Readings insert policy"
ON public.bp_readings FOR INSERT
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "BP Readings update policy"
ON public.bp_readings FOR UPDATE
USING (patient_id = auth.uid());

CREATE POLICY "BP Readings delete policy"
ON public.bp_readings FOR DELETE
USING (patient_id = auth.uid());

-- Glucose Readings
CREATE POLICY "Glucose Readings access policy"
ON public.glucose_readings FOR SELECT
USING (
  patient_id = auth.uid() 
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.patient_doctor_consents
    WHERE patient_id = glucose_readings.patient_id AND doctor_id = auth.uid() AND is_active = TRUE
  )
);

CREATE POLICY "Glucose Readings insert policy"
ON public.glucose_readings FOR INSERT
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Glucose Readings update policy"
ON public.glucose_readings FOR UPDATE
USING (patient_id = auth.uid());

CREATE POLICY "Glucose Readings delete policy"
ON public.glucose_readings FOR DELETE
USING (patient_id = auth.uid());

-- Appointments policy
CREATE POLICY "Appointments select policy"
ON public.appointments FOR SELECT
USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR public.is_admin());

CREATE POLICY "Appointments insert policy"
ON public.appointments FOR INSERT
WITH CHECK (patient_id = auth.uid() OR public.is_admin());

CREATE POLICY "Appointments update policy"
ON public.appointments FOR UPDATE
USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR public.is_admin());

-- Notifications
CREATE POLICY "Notifications select policy"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Notifications update policy"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());
