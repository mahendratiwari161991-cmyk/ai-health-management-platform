'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Droplets,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Pill,
  Bot,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { INITIAL_BP_READINGS, INITIAL_GLUCOSE_READINGS, INITIAL_MEDICATIONS, INITIAL_APPOINTMENTS } from '@/lib/mock-data';
import { classifyBP, classifyGlucose } from '@/lib/health-utils';

export default function PatientDashboard() {
  const [bpReadings] = useState(INITIAL_BP_READINGS);
  const [glucoseReadings] = useState(INITIAL_GLUCOSE_READINGS);
  const [medications] = useState(INITIAL_MEDICATIONS);
  const [appointments] = useState(INITIAL_APPOINTMENTS);

  // Latest metrics
  const latestBP = bpReadings[bpReadings.length - 1];
  const bpStatus = latestBP ? classifyBP(latestBP.systolic, latestBP.diastolic) : null;

  const fastingReadings = glucoseReadings.filter((g) => g.measurement_type === 'fasting');
  const latestFasting = fastingReadings[fastingReadings.length - 1];
  const fastingStatus = latestFasting ? classifyGlucose(latestFasting.glucose_value, 'fasting') : null;

  const postMealReadings = glucoseReadings.filter((g) => g.measurement_type === 'post_meal_2h');
  const latestPostMeal = postMealReadings[postMealReadings.length - 1];
  const postMealStatus = latestPostMeal ? classifyGlucose(latestPostMeal.glucose_value, 'post_meal_2h') : null;

  // Averages
  const avgSystolic = Math.round(bpReadings.reduce((acc, curr) => acc + curr.systolic, 0) / bpReadings.length);
  const avgDiastolic = Math.round(bpReadings.reduce((acc, curr) => acc + curr.diastolic, 0) / bpReadings.length);
  const avgFastingGlucose = Math.round(fastingReadings.reduce((acc, curr) => acc + curr.glucose_value, 0) / (fastingReadings.length || 1));

  // Chart data formatting
  const bpChartData = bpReadings.map((r) => ({
    date: new Date(r.measured_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    systolic: r.systolic,
    diastolic: r.diastolic,
    pulse: r.pulse,
  }));

  const glucoseChartData = glucoseReadings.map((r) => ({
    date: new Date(r.measured_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    value: r.glucose_value,
    type: r.measurement_type === 'fasting' ? 'Fasting' : 'Post-Meal',
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Emergency Disclaimer */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-2xl text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-3">
            <Activity className="w-3.5 h-3.5" />
            Active Clinical Monitoring
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Arun Kumar
          </h1>
          <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
            Your cardiovascular and glycemic readings have remained stable over the past 7 days. AI insights and diet plans are ready for your review.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/patient/bp-tracking"
              className="inline-flex items-center gap-2 bg-white text-blue-900 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm hover:bg-blue-50 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-rose-600" />
              Log BP Reading
            </Link>
            <Link
              href="/patient/glucose-tracking"
              className="inline-flex items-center gap-2 bg-blue-800/80 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm border border-blue-400/30 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-cyan-300" />
              Log Glucose Reading
            </Link>
            <Link
              href="/patient/ai-assistant"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-sm transition-all"
            >
              <Bot className="w-4 h-4" />
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-xl flex items-start space-x-3 text-rose-900 text-sm shadow-xs">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="leading-snug">
          <span className="font-bold">Medical Emergency Notice:</span> If you experience severe chest pain, shortness of breath, sudden numbness, or blood sugar below 70 mg/dL or above 300 mg/dL with confusion, contact local emergency medical services or visit the nearest emergency room immediately. AI suggestions are educational and not a replacement for urgent clinical care.
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Blood Pressure Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today Blood Pressure</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : '--/--'}
            </span>
            <span className="text-xs font-semibold text-slate-500">mmHg</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${bpStatus?.bgLight} ${bpStatus?.color}`}>
              {bpStatus?.category}
            </span>
            <span className="text-xs text-slate-500">Pulse: {latestBP?.pulse || '--'} bpm</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>7-Day Avg: {avgSystolic}/{avgDiastolic} mmHg</span>
            <Link href="/patient/bp-tracking" className="text-blue-600 font-semibold hover:underline">
              View Log &rarr;
            </Link>
          </div>
        </div>

        {/* Fasting Glucose Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Latest Fasting Sugar</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {latestFasting ? latestFasting.glucose_value : '--'}
            </span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${fastingStatus?.bgLight} ${fastingStatus?.color}`}>
              {fastingStatus?.category}
            </span>
            <span className="text-xs text-slate-500">Target: 70-100</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Fasting Avg: {avgFastingGlucose} mg/dL</span>
            <Link href="/patient/glucose-tracking" className="text-blue-600 font-semibold hover:underline">
              View Log &rarr;
            </Link>
          </div>
        </div>

        {/* Post-Meal Glucose Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">2-Hr Post-Meal Sugar</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {latestPostMeal ? latestPostMeal.glucose_value : '--'}
            </span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${postMealStatus?.bgLight} ${postMealStatus?.color}`}>
              {postMealStatus?.category}
            </span>
            <span className="text-xs text-slate-500">Target: &lt;140</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Last meal: Rotis &amp; Dal</span>
            <Link href="/patient/glucose-tracking" className="text-blue-600 font-semibold hover:underline">
              Analyze &rarr;
            </Link>
          </div>
        </div>

        {/* HbA1c & Weight Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Latest HbA1c &amp; BMI</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-extrabold text-slate-900">6.8%</span>
              <span className="text-xs font-semibold text-slate-500 ml-1">HbA1c</span>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <span className="text-xl font-bold text-slate-800">26.5</span>
              <span className="text-xs font-semibold text-slate-500 ml-1">BMI</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Moderate Control
            </span>
            <span className="text-xs text-slate-500">Weight: 78.5 kg</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Lab Test: 12 Oct 2026</span>
            <Link href="/patient/records" className="text-blue-600 font-semibold hover:underline">
              Lab Reports &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure Trends */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                Blood Pressure Trends (Systolic vs Diastolic)
              </h2>
              <p className="text-xs text-slate-500">Chronological comparison over last recorded sessions</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md">
              Target: &lt;130/85 mmHg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[60, 160]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic (mmHg)"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic (mmHg)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Glucose Trends */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-600" />
                Blood Sugar Tracking (Separate Fasting &amp; Post-Meal)
              </h2>
              <p className="text-xs text-slate-500">Clinical standard separates fasting vs post-prandial averages</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md">
              Unit: mg/dL
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[70, 200]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Glucose Level"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Schedules & Reminders: Medications & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medication Schedule Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600" />
                Today Medication Schedule
              </h3>
              <p className="text-xs text-slate-500">Track doses and verify timing</p>
            </div>
            <Link href="/patient/medications" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage Medicines &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {medications.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {med.dosage}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{med.name}</h4>
                    <p className="text-xs text-slate-500">{med.instructions} • {med.frequency}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                    {med.timing.join(', ')}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Taken
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Doctor Consultations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Next Appointment
              </h3>
              <Link href="/patient/appointments" className="text-xs font-semibold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {appointments.length > 0 ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    DR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{appointments[0].doctor?.full_name}</h4>
                    <p className="text-xs text-slate-600">{appointments[0].doctor?.specialty}</p>
                    <p className="text-[11px] text-slate-500">{appointments[0].doctor?.hospital_clinic_name}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Sat, 28 Nov 2026 • 10:00 AM IST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="capitalize font-semibold text-emerald-700">{appointments[0].consultation_type} Consultation ({appointments[0].status})</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href={`/patient/video-call?room=${appointments[0].meeting_room_id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-colors"
                  >
                    Join Video Consultation Room
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No upcoming appointments scheduled.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/patient/doctors"
              className="text-xs font-bold text-slate-800 flex items-center justify-between hover:text-blue-600"
            >
              <span>Book consultation with Diabetologist</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
