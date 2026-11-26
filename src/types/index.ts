export type UserRole = 'patient' | 'doctor' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface PatientProfile extends Profile {
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  diabetes_type?: string;
  existing_conditions?: string[];
  allergies?: string[];
  current_medications_summary?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  target_systolic_min?: number;
  target_systolic_max?: number;
  target_diastolic_min?: number;
  target_diastolic_max?: number;
  target_fasting_min?: number;
  target_fasting_max?: number;
  target_postmeal_max?: number;
}

export interface DoctorProfile extends Profile {
  qualifications: string;
  medical_registration_no: string;
  specialty: string;
  years_of_experience: number;
  hospital_clinic_name?: string;
  consultation_fee: number;
  languages_spoken: string[];
  bio?: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  total_reviews: number;
  available_days: string[];
}

export interface BPReading {
  id: string;
  patient_id: string;
  measured_at: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  measurement_position?: string;
  arm?: string;
  notes?: string;
  is_critical?: boolean;
}

export interface GlucoseReading {
  id: string;
  patient_id: string;
  measured_at: string;
  glucose_value: number;
  unit: 'mg_dL' | 'mmol_L';
  measurement_type: 'fasting' | 'before_meal' | 'post_meal_1h' | 'post_meal_2h' | 'random' | 'bedtime';
  meal_details?: string;
  notes?: string;
  is_critical?: boolean;
}

export interface LifestyleRecord {
  id: string;
  patient_id: string;
  recorded_date: string;
  weight_kg?: number;
  bmi?: number;
  walking_steps?: number;
  exercise_minutes?: number;
  sleep_hours?: number;
  water_liters?: number;
  diet_notes?: string;
}

export interface Medication {
  id: string;
  patient_id: string;
  prescribed_by?: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  instructions: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_start: string;
  scheduled_end: string;
  consultation_type: 'video' | 'clinic';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  chief_complaints?: string;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  meeting_room_id?: string;
  doctor?: DoctorProfile;
  patient?: PatientProfile;
}

export interface Prescription {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id?: string;
  diagnosis: string;
  prescribed_date: string;
  special_precautions?: string;
  is_finalized: boolean;
  doctor_name?: string;
  patient_name?: string;
  doctor_reg_no?: string;
  items: PrescriptionItem[];
}

export interface PrescriptionItem {
  id?: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface MedicalReport {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id?: string;
  consultation_date: string;
  chief_complaints: string;
  clinical_observations?: string;
  bp_recorded?: string;
  glucose_recorded?: string;
  diagnosis: string;
  treatment_plan: string;
  follow_up_date?: string;
  recommendations?: string;
  doctor?: DoctorProfile;
  patient?: PatientProfile;
}

export interface AIInsight {
  id: string;
  category: 'bp_trend' | 'glucose_trend' | 'medication_risk' | 'lifestyle';
  severity: 'info' | 'caution' | 'warning' | 'emergency';
  title: string;
  summary: string;
  recommendations: string[];
  created_at: string;
}
