'use client';

import React, { useState } from 'react';
import {
  Users,
  Heart,
  Droplets,
  Calendar,
  FileText,
  Clock,
  Download,
  AlertTriangle,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
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
import { INITIAL_BP_READINGS, INITIAL_GLUCOSE_READINGS, INITIAL_MEDICATIONS } from '@/lib/mock-data';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DoctorPatientsPage() {
  const [selectedPatient] = useState({
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Arun Kumar',
    age: 51,
    gender: 'Male',
    diabetesType: 'Type 2',
    hba1c: '6.8%',
    bmi: 26.5,
    conditions: 'Hypertension, Dyslipidemia',
    allergies: 'Penicillin',
    medications: INITIAL_MEDICATIONS,
  });

  // Chart telemetry data
  const bpChartData = INITIAL_BP_READINGS.map((r) => ({
    date: new Date(r.measured_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    systolic: r.systolic,
    diastolic: r.diastolic,
  }));

  const glucoseChartData = INITIAL_GLUCOSE_READINGS.map((r) => ({
    date: new Date(r.measured_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    fasting: r.measurement_type === 'fasting' ? r.glucose_value : null,
    postMeal: r.measurement_type.startsWith('post_meal') ? r.glucose_value : null,
  }));

  // Generate Doctor Summary PDF
  const downloadDoctorSummaryPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Doctor Clinical Patient Summary & Telemetry', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Consultant: Dr. Rajesh Sharma, MD (Reg: MCI-1998-4458)`, 14, 27);
    doc.text(`Patient: ${selectedPatient.name} | Age: ${selectedPatient.age} | ${selectedPatient.conditions}`, 14, 33);
    doc.text(`Date of Evaluation: ${new Date().toLocaleDateString('en-IN')}`, 14, 39);

    const bpData = INITIAL_BP_READINGS.map((r) => [
      new Date(r.measured_at).toLocaleDateString('en-IN'),
      `${r.systolic}/${r.diastolic} mmHg`,
      r.pulse ? `${r.pulse} bpm` : '--',
      r.notes || 'Normal',
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Date', 'BP Reading', 'Pulse', 'Patient Notes']],
      body: bpData,
      headStyles: { fillColor: [30, 58, 138] },
    });

    doc.save(`Clinical_Summary_${selectedPatient.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Users className="w-8 h-8 text-blue-600" />
            Patient Clinical Records &amp; Continuous Telemetry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review authorized patient vitals, historical blood pressure curves, and separate fasting/post-meal glucose trends.
          </p>
        </div>

        <button
          onClick={downloadDoctorSummaryPDF}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Doctor Summary PDF
        </button>
      </div>

      {/* Patient Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
            AK
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {selectedPatient.diabetesType}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Age: {selectedPatient.age} yrs • Gender: {selectedPatient.gender} • BMI: {selectedPatient.bmi} • HbA1c: {selectedPatient.hba1c}
            </p>
            <p className="text-xs text-slate-500">
              Allergies: <span className="font-semibold text-rose-600">{selectedPatient.allergies}</span> | Conditions: {selectedPatient.conditions}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Digital Consent Verified
          </span>
        </div>
      </div>

      {/* Side-by-side Telemetry Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BP Telemetry */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              Continuous BP Telemetry (Systolic/Diastolic)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Goal: &lt;130/80</span>
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
                <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Glucose Telemetry */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-600" />
              Glycemic Separation (Fasting vs Post-Meal)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
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
                <Line connectNulls type="monotone" dataKey="fasting" name="Fasting" stroke="#0891b2" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line connectNulls type="monotone" dataKey="postMeal" name="2h Post-Meal" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Medications & Clinical Observations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Patient Active Medications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedPatient.medications.map((m) => (
            <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <h4 className="text-sm font-bold text-slate-900">{m.name} ({m.dosage})</h4>
              <p className="text-xs text-slate-600">{m.frequency} • {m.timing.join(', ')}</p>
              <p className="text-[11px] text-slate-500 italic">{m.instructions}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
