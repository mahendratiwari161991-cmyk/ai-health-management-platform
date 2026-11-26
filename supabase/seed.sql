-- Mock / Seed Data for Development and Testing
-- Can be run in Supabase SQL editor or local instance

INSERT INTO public.profiles (id, email, full_name, role, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@aihealth.com', 'System Administrator', 'admin', '+91 9876543210'),
  ('00000000-0000-0000-0000-000000000002', 'dr.rajesh@aihealth.com', 'Dr. Rajesh Sharma, MD', 'doctor', '+91 9876543211'),
  ('00000000-0000-0000-0000-000000000003', 'dr.anita@aihealth.com', 'Dr. Anita Desai, DM', 'doctor', '+91 9876543212'),
  ('00000000-0000-0000-0000-000000000004', 'patient.arun@example.com', 'Arun Kumar', 'patient', '+91 9876543213')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.doctor_profiles (id, qualifications, medical_registration_no, specialty, years_of_experience, hospital_clinic_name, consultation_fee, languages_spoken, bio, verification_status, verified_at, rating, total_reviews)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'MBBS, MD (Medicine), DM (Endocrinology)', 'MCI-1998-4458', 'Diabetologist', 15, 'Apollo Health City', 800.00, ARRAY['English', 'Hindi'], 'Specialist in metabolic syndromes, Type 2 diabetes management and lifestyle reversals.', 'approved', NOW(), 4.9, 128),
  ('00000000-0000-0000-0000-000000000003', 'MBBS, MD (Cardiology), FACC', 'MCI-2005-7790', 'Cardiologist', 12, 'Fortis Memorial Hospital', 1000.00, ARRAY['English', 'Hindi', 'Marathi'], 'Senior consultant cardiologist specializing in hypertensive heart disease and preventive cardiology.', 'approved', NOW(), 4.8, 94)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.patient_profiles (id, date_of_birth, gender, height_cm, weight_kg, diabetes_type, existing_conditions, allergies, current_medications_summary, emergency_contact_name, emergency_contact_phone, emergency_contact_relation)
VALUES 
  ('00000000-0000-0000-0000-000000000004', '1975-06-15', 'Male', 172.0, 78.5, 'Type 2', ARRAY['Hypertension', 'Dyslipidemia'], ARRAY['Penicillin'], 'Metformin 500mg BD, Telmisartan 40mg OD', 'Sunita Kumar', '+91 9876543299', 'Spouse')
ON CONFLICT (id) DO NOTHING;

-- Seed initial BP Readings for Arun Kumar
INSERT INTO public.bp_readings (patient_id, measured_at, systolic, diastolic, pulse, measurement_position, notes)
VALUES 
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '5 days', 138, 88, 76, 'sitting', 'Evening reading, felt slightly stressed'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '4 days', 132, 84, 72, 'sitting', 'Morning reading after 15 mins rest'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 days', 128, 82, 70, 'sitting', 'Morning post yoga'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 days', 135, 86, 75, 'sitting', 'After office commute'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 day', 126, 80, 68, 'sitting', 'Normal morning reading'),
  ('00000000-0000-0000-0000-000000000004', NOW(), 125, 82, 72, 'sitting', 'Today morning reading')
ON CONFLICT DO NOTHING;

-- Seed Glucose Readings for Arun Kumar
INSERT INTO public.glucose_readings (patient_id, measured_at, glucose_value, unit, measurement_type, meal_details, notes)
VALUES 
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 days' + INTERVAL '8 hours', 108.0, 'mg_dL', 'fasting', 'Overnight fast 10 hrs', 'Morning baseline'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '3 days' + INTERVAL '14 hours', 142.0, 'mg_dL', 'post_meal_2h', '2 Rotis, dal, mixed veg', 'Post lunch reading'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 days' + INTERVAL '8 hours', 112.0, 'mg_dL', 'fasting', 'Overnight fast', 'Slightly high baseline'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 days' + INTERVAL '14 hours', 138.0, 'mg_dL', 'post_meal_2h', 'Brown rice, paneer curry', 'Post lunch reading'),
  ('00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 day' + INTERVAL '8 hours', 104.0, 'mg_dL', 'fasting', 'Overnight fast', 'Well controlled'),
  ('00000000-0000-0000-0000-000000000004', NOW() + INTERVAL '8 hours', 102.0, 'mg_dL', 'fasting', 'Overnight fast', 'Today morning')
ON CONFLICT DO NOTHING;
