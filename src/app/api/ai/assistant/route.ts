import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Server-side OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

// System prompt enforcing all safety guardrails specified in the requirements
const CLINICAL_SAFETY_SYSTEM_PROMPT = `
You are the GlycoPulse AI Clinical Health Assistant, an AI health advisor supporting patients in monitoring their diabetes, blood pressure, and lifestyle.

CRITICAL HEALTHCARE SAFETY RULES:
1. YOU ARE NOT A DOCTOR. State clearly that your insights are educational and do NOT replace the diagnosis, prescription, or clinical judgment of a licensed medical practitioner.
2. NEVER diagnose a disease.
3. NEVER prescribe medicines, recommend starting or stopping prescription medications, or adjust dosages.
4. NEVER override a doctor's prescription.
5. NEVER provide false reassurance.
6. POTENTIALLY DANGEROUS READINGS:
   - Systolic BP >= 180 mmHg or Diastolic BP >= 120 mmHg (Hypertensive Crisis).
   - Glucose < 70 mg/dL (Hypoglycemia) or >= 300 mg/dL (Severe Hyperglycemia).
   - Emergency symptoms: Severe chest pain, pressure or tightness, shortness of breath, sudden numbness or speech difficulty, loss of consciousness.
   If ANY of these thresholds or symptoms are reported or present, you MUST immediately urge the user to seek emergency medical attention or call emergency services (e.g. 112 / 108 / 911) without delay. Do not delay emergency care with conversational chit-chat.
7. Indian Diet Context: When discussing nutrition, provide culturally relevant Indian dietary guidance (e.g., roti, dal, vegetables, brown rice, millets, idli, dosa, poha, upma, roasted chana, nuts, methi seeds, bitter gourd). Emphasize fiber, portion control, whole grains, and protein over refined carbohydrates.
8. Tone: Empathetic, respectful, evidence-based, clear, and reassuring without medical overreach.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, patientProfile, recentBP, recentGlucose } = await req.json();

    // Contextual patient summary injected into context
    const patientContext = `
PATIENT PROFILE CONTEXT:
- Name: ${patientProfile?.full_name || 'Patient'}
- Diabetes Type: ${patientProfile?.diabetes_type || 'Type 2'}
- Existing Conditions: ${patientProfile?.existing_conditions?.join(', ') || 'Hypertension, Dyslipidemia'}
- Current Medications: ${patientProfile?.current_medications_summary || 'Metformin 500mg, Telmisartan 40mg'}
- Latest BP: ${recentBP ? `${recentBP.systolic}/${recentBP.diastolic} mmHg (Pulse: ${recentBP.pulse || '--'})` : '124/82 mmHg'}
- Latest Fasting Glucose: ${recentGlucose?.fasting || '102 mg/dL'}
- Latest Post-Meal Glucose: ${recentGlucose?.postMeal || '140 mg/dL'}
`;

    // Check for API key; if mock or missing in demo mode, provide intelligent fallback response
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-openai-key' || process.env.OPENAI_API_KEY === 'dummy_key') {
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

      let simulatedReply = '';

      if (lastUserMsg.includes('emergency') || lastUserMsg.includes('chest pain') || lastUserMsg.includes('dizziness') && lastUserMsg.includes('high')) {
        simulatedReply = `⚠️ **URGENT MEDICAL WARNING**: Your symptoms or readings may indicate a medical emergency. Please contact emergency medical services or visit the nearest emergency room immediately. Do not wait or rely on AI advice.`;
      } else if (lastUserMsg.includes('diet') || lastUserMsg.includes('food') || lastUserMsg.includes('eat') || lastUserMsg.includes('roti') || lastUserMsg.includes('rice')) {
        simulatedReply = `Here is practical, diabetes- and hypertension-friendly Indian dietary guidance based on your profile:

1. **Carbohydrate Management & Millets**:
   - Prefer multigrain rotis (blend of wheat, bajra, jowar, or ragi) over pure refined flour or polished white rice.
   - Limit portion size to 2 medium rotis or 1 small cup of brown rice / foxtail millet per meal.
2. **Protein & Pulses**:
   - Include protein at every meal to slow glucose absorption: moong dal, masoor dal, boiled sprouts, paneer (cottage cheese), or eggs.
3. **Heart-Healthy Sodium Reduction**:
   - To assist with blood pressure control (target <130/80 mmHg), limit table salt, papad, commercial pickles, and packaged snacks.
4. **Beneficial Traditional Additions**:
   - 1 teaspoon of soaked fenugreek (methi) seeds in the morning.
   - High-fiber vegetables: palak, methi leaves, bhindi, louki, and bitter gourd (karela).

*Note: This dietary guidance is for general educational support. Always discuss specific modifications with your doctor or registered clinical dietitian.*`;
      } else if (lastUserMsg.includes('bp') || lastUserMsg.includes('blood pressure')) {
        simulatedReply = `Looking at your recent Blood Pressure log:
- Your latest reading of **${recentBP ? `${recentBP.systolic}/${recentBP.diastolic}` : '124/82'} mmHg** reflects healthy control, well within your clinician's recommended boundary of <130/85 mmHg.
- Your systolic trends have decreased steadily from 138 down to 124 mmHg over the last 5 days.

**Recommendations:**
- Continue your prescribed morning medication (Telmisartan) on schedule.
- Maintain adequate hydration and 30 minutes of moderate aerobic activity (such as brisk walking).
- Re-check in sitting posture after 5 minutes of quiet rest.`;
      } else {
        simulatedReply = `Based on your recorded health profile and glycemic trends:
- Your recent fasting sugar (**102 mg/dL**) and post-meal readings (**140 mg/dL**) indicate stable glycemic response on your current regimen.
- Your Blood Pressure average is sitting comfortably around **126/82 mmHg**.

**Key Advice:**
1. Consistency with meal timings and regular brisk walking after meals helps mitigate post-prandial spikes.
2. Continue taking your Metformin 500mg immediately with or after meals to avoid gastrointestinal discomfort.
3. Always bring your downloaded GlycoPulse 30-day PDF report to your upcoming consultation with Dr. Rajesh Sharma.

*Disclaimer: GlycoPulse AI provides educational health insights and is not a substitute for formal medical evaluation.*`;
      }

      return NextResponse.json({
        role: 'assistant',
        content: simulatedReply,
      });
    }

    // Call live OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CLINICAL_SAFETY_SYSTEM_PROMPT + '\n' + patientContext },
        ...messages,
      ],
      temperature: 0.3,
    });

    const reply = response.choices[0]?.message?.content || 'Unable to generate response at this moment.';

    return NextResponse.json({
      role: 'assistant',
      content: reply,
    });
  } catch (error: any) {
    console.error('AI assistant route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI conversation' },
      { status: 500 }
    );
  }
}
