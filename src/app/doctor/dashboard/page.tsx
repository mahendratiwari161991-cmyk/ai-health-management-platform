'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Users,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Video,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { DOCTORS_DIRECTORY, INITIAL_APPOINTMENTS, INITIAL_BP_READINGS, INITIAL_GLUCOSE_READINGS } from '@/lib/mock-data';

export default function DoctorDashboard() {
  const doctor = DOCTORS_DIRECTORY[0]; // Dr. Rajesh Sharma, MD

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold backdrop-blur-md mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified Practitioner (Reg: {doctor.medical_registration_no})
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {doctor.full_name}
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1">
              Senior Consultant {doctor.specialty} • {doctor.hospital_clinic_name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/doctor/prescriptions"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
            >
              <Pill className="w-4 h-4" />
              Issue Digital Prescription
            </Link>
            <Link
              href="/doctor/reports"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs hover:bg-slate-100 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              Draft Clinical Report
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Authorized Patients</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">48</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">+4 new this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Today Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">6</div>
          <span className="text-xs text-slate-500 mt-1 block">4 Video, 2 In-Clinic</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Critical Patient Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-rose-600">0</div>
          <span className="text-xs text-slate-500 mt-1 block">All vitals currently in acceptable range</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Prescriptions Issued</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">114</div>
          <span className="text-xs text-slate-500 mt-1 block">Cryptographically signed</span>
        </div>
      </div>

      {/* Main Section: Authorized Patients & Pending Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consented Patients List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Authorized Patients (Consent Active)
              </h2>
              <p className="text-xs text-slate-500">Access to longitudinal BP and glycemic telemetry</p>
            </div>
            <Link href="/doctor/patients" className="text-xs font-semibold text-blue-600 hover:underline">
              View All Patients &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                  AK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Arun Kumar (Age: 51, Male)</h4>
                  <p className="text-xs text-slate-500">Type 2 Diabetes • Hypertension • Metformin 500mg, Telmisartan 40mg</p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold">
                    <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Latest BP: 124/82 mmHg
                    </span>
                    <span className="text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      Fasting Sugar: 102 mg/dL
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/doctor/patients"
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-xs transition-colors"
                >
                  View Vitals Chart
                </Link>
                <Link
                  href="/doctor/prescriptions"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  Prescribe
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Upcoming Video Session
              </h2>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Confirmed</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  AK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Arun Kumar</h4>
                  <p className="text-xs text-indigo-700 font-medium">3-Month Glycemic Review</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Sat, 28 Nov 2026 • 10:00 AM IST
                </div>
                <div className="text-slate-500">
                  Room: AIHealth-Consult-Apt1-Rajesh-Arun
                </div>
              </div>

              <Link
                href="/doctor/video-consult?room=AIHealth-Consult-Apt1-Rajesh-Arun"
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors"
              >
                <Video className="w-4 h-4" />
                Join Video Consultation
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link href="/doctor/appointments" className="text-xs font-bold text-blue-600 hover:underline">
              View Complete Schedule &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
