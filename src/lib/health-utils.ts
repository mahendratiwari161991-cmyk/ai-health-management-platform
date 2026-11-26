import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// BP Category classification based on standard clinical guidelines (AHA/ACC)
export function classifyBP(systolic: number, diastolic: number): {
  category: 'Normal' | 'Elevated' | 'Hypertension Stage 1' | 'Hypertension Stage 2' | 'Hypertensive Crisis';
  color: string;
  bgLight: string;
  isEmergency: boolean;
  guidance: string;
} {
  if (systolic >= 180 || diastolic >= 120) {
    return {
      category: 'Hypertensive Crisis',
      color: 'text-rose-700',
      bgLight: 'bg-rose-50 border-rose-300',
      isEmergency: true,
      guidance: 'Critically high blood pressure. Seek emergency medical attention immediately if accompanied by chest pain, shortness of breath, or headache.',
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'Hypertension Stage 2',
      color: 'text-amber-700',
      bgLight: 'bg-amber-50 border-amber-300',
      isEmergency: false,
      guidance: 'High blood pressure (Stage 2). Consult your doctor to review your medical management and lifestyle factors.',
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'Hypertension Stage 1',
      color: 'text-amber-600',
      bgLight: 'bg-amber-50 border-amber-200',
      isEmergency: false,
      guidance: 'Mildly elevated BP (Stage 1). Dietary modification, sodium reduction, and regular monitoring recommended.',
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'Elevated',
      color: 'text-blue-700',
      bgLight: 'bg-blue-50 border-blue-200',
      isEmergency: false,
      guidance: 'Slightly elevated systolic BP. Maintain an active lifestyle and heart-healthy diet.',
    };
  }
  return {
    category: 'Normal',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50 border-emerald-200',
    isEmergency: false,
    guidance: 'Normal reading. Blood pressure is within standard healthy parameters.',
  };
}

// Glucose Category classification
export function classifyGlucose(
  value: number,
  type: 'fasting' | 'before_meal' | 'post_meal_1h' | 'post_meal_2h' | 'random' | 'bedtime',
  unit: 'mg_dL' | 'mmol_L' = 'mg_dL'
): {
  category: 'Hypoglycemia' | 'Optimal' | 'Pre-diabetes / Elevated' | 'High' | 'Severe Hyperglycemia';
  color: string;
  bgLight: string;
  isEmergency: boolean;
  guidance: string;
} {
  // Normalize to mg/dL for clinical calculation
  const valMgDl = unit === 'mmol_L' ? value * 18.0182 : value;

  if (valMgDl < 70) {
    return {
      category: 'Hypoglycemia',
      color: 'text-rose-700',
      bgLight: 'bg-rose-50 border-rose-300',
      isEmergency: true,
      guidance: 'Low blood sugar (<70 mg/dL). Follow the 15-15 rule (consume 15g fast-acting carbs e.g. fruit juice, re-check in 15 mins). Consult a doctor if persistent.',
    };
  }

  if (valMgDl >= 300) {
    return {
      category: 'Severe Hyperglycemia',
      color: 'text-rose-700',
      bgLight: 'bg-rose-50 border-rose-300',
      isEmergency: true,
      guidance: 'Very high glucose level (≥300 mg/dL). Risk of ketoacidosis or hyperosmolar state. Contact emergency care or your treating physician urgently.',
    };
  }

  if (type === 'fasting' || type === 'before_meal') {
    if (valMgDl <= 100) {
      return {
        category: 'Optimal',
        color: 'text-emerald-700',
        bgLight: 'bg-emerald-50 border-emerald-200',
        isEmergency: false,
        guidance: 'Normal fasting glucose (70-100 mg/dL).',
      };
    } else if (valMgDl <= 125) {
      return {
        category: 'Pre-diabetes / Elevated',
        color: 'text-amber-600',
        bgLight: 'bg-amber-50 border-amber-200',
        isEmergency: false,
        guidance: 'Impaired fasting glucose (101-125 mg/dL). Discuss dietary adjustments and exercise with your doctor.',
      };
    } else {
      return {
        category: 'High',
        color: 'text-amber-800',
        bgLight: 'bg-amber-100 border-amber-300',
        isEmergency: false,
        guidance: 'Elevated fasting glucose (≥126 mg/dL). Consistent readings indicate diabetic range; review with doctor.',
      };
    }
  } else {
    // Post-meal or random
    if (valMgDl < 140) {
      return {
        category: 'Optimal',
        color: 'text-emerald-700',
        bgLight: 'bg-emerald-50 border-emerald-200',
        isEmergency: false,
        guidance: 'Optimal post-meal reading (<140 mg/dL).',
      };
    } else if (valMgDl <= 199) {
      return {
        category: 'Pre-diabetes / Elevated',
        color: 'text-amber-600',
        bgLight: 'bg-amber-50 border-amber-200',
        isEmergency: false,
        guidance: 'Elevated post-meal glucose (140-199 mg/dL). Monitor carb intake and physical activity.',
      };
    } else {
      return {
        category: 'High',
        color: 'text-amber-800',
        bgLight: 'bg-amber-100 border-amber-300',
        isEmergency: false,
        guidance: 'High post-meal glucose (≥200 mg/dL). Requires ongoing review with your prescribing doctor.',
      };
    }
  }
}

export function convertGlucose(value: number, from: 'mg_dL' | 'mmol_L', to: 'mg_dL' | 'mmol_L'): number {
  if (from === to) return value;
  if (from === 'mg_dL' && to === 'mmol_L') {
    return Number((value / 18.0182).toFixed(1));
  }
  return Number((value * 18.0182).toFixed(0));
}
