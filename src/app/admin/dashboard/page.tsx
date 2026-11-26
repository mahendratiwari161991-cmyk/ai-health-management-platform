'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  Stethoscope,
  Calendar,
  Layers,
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 mb-2">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Administrative Governance &amp; Compliance Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital &amp; Clinical Management Console
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Verify practitioner licenses, oversee audit logs, and monitor healthcare AI safety thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/doctor-verifications"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
            >
              <Stethoscope className="w-4 h-4" />
              Doctor Verifications (1 Pending)
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Registered Patients</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">1,248</div>
          <span className="text-xs text-slate-500 mt-1 block">Active BP &amp; Diabetes monitors</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Verified Doctors</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">42</div>
          <span className="text-xs text-amber-600 font-semibold mt-1 block">1 verification pending</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Completed Consultations</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">892</div>
          <span className="text-xs text-slate-500 mt-1 block">Video &amp; Clinic visits</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">AI Safety Interventions</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-amber-600">3</div>
          <span className="text-xs text-slate-500 mt-1 block">Emergency escalation triggers</span>
        </div>
      </div>

      {/* Admin Quick Links & Compliance Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            Clinical Privacy &amp; Governance Rules
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              1. <strong>Prescription Integrity:</strong> Administrators have zero permission to alter, override, or delete digital prescriptions issued by doctors.
            </p>
            <p>
              2. <strong>Patient Medical Access Auditing:</strong> Every query or view of sensitive patient telemetry generates an immutable audit record in accordance with healthcare privacy standards.
            </p>
            <p>
              3. <strong>Practitioner Licensing:</strong> Doctors cannot accept bookings until their medical registration credentials are reviewed against state councils.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Administrative Quick Operations
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/doctor-verifications"
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-blue-600" />
              Verify Doctors
            </Link>
            <Link
              href="/admin/audit-logs"
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              View Audit Trail
            </Link>
            <Link
              href="/admin/patients"
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-cyan-600" />
              Patient Accounts
            </Link>
            <Link
              href="/admin/ai-management"
              className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-600" />
              AI Prompt &amp; Safety
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
