'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  User,
  Filter,
} from 'lucide-react';
import { INITIAL_APPOINTMENTS } from '@/lib/mock-data';
import Link from 'next/link';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const handleStatusChange = (id: string, status: any) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Calendar className="w-8 h-8 text-blue-600" />
          Doctor Appointment Management &amp; Scheduling
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review booked patient appointments, accept requests, and join teleconsultation rooms.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Consultation Schedule</h2>
          <span className="text-xs text-slate-500">{appointments.length} appointments scheduled</span>
        </div>

        <div className="divide-y divide-slate-100">
          {appointments.map((apt) => (
            <div key={apt.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  AK
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Arun Kumar (Age: 51, Male)</h3>
                  <p className="text-xs text-slate-500">Chief Complaints: &ldquo;{apt.chief_complaints}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Sat, 28 Nov 2026 • 10:00 AM
                    </span>
                    <span className="capitalize">{apt.consultation_type} Consultation</span>
                    <span>Fee: ₹{apt.amount} ({apt.payment_status})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${
                  apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {apt.status}
                </span>

                <Link
                  href={`/doctor/video-consult?room=${apt.meeting_room_id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join Room
                </Link>

                <button
                  onClick={() => handleStatusChange(apt.id, 'completed')}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Mark Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
