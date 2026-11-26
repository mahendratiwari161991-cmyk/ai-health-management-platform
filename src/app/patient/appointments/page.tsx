'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  FileText,
  User,
} from 'lucide-react';
import { INITIAL_APPOINTMENTS } from '@/lib/mock-data';
import { Appointment } from '@/types';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this scheduled appointment?')) {
      setAppointments(
        appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-8 h-8 text-blue-600" />
            My Appointments &amp; Consultations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage upcoming video appointments, clinic visits, and consultation history.
          </p>
        </div>

        <Link
          href="/patient/doctors"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
        >
          Book New Consultation
        </Link>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                DR
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{apt.doctor?.full_name}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {apt.doctor?.specialty}
                  </span>
                </div>

                <p className="text-xs text-slate-500">{apt.doctor?.hospital_clinic_name}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Sat, 28 Nov 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    10:00 AM - 10:30 AM IST
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    {apt.consultation_type === 'video' ? (
                      <Video className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    {apt.consultation_type} Consultation
                  </span>
                </div>

                <p className="text-xs text-slate-500 italic mt-1">
                  &ldquo;{apt.chief_complaints}&rdquo;
                </p>
              </div>
            </div>

            {/* Actions & Status */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold capitalize ${
                  apt.status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : apt.status === 'cancelled'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {apt.status}
              </span>

              {apt.status === 'confirmed' && apt.consultation_type === 'video' && (
                <Link
                  href={`/patient/video-call?room=${apt.meeting_room_id}`}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
                >
                  <Video className="w-4 h-4" />
                  Join Consultation Room
                </Link>
              )}

              {apt.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(apt.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-3 py-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
