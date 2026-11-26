'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock,
  Building,
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '@/lib/mock-data';
import { DoctorProfile } from '@/types';

export default function DoctorVerificationsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([
    ...DOCTORS_DIRECTORY,
    {
      id: 'doc-pending-1',
      email: 'dr.sanjay@cityhospital.in',
      full_name: 'Dr. Sanjay Kulkarni, MD',
      role: 'doctor',
      is_active: true,
      created_at: '2026-11-20T10:00:00.000Z',
      qualifications: 'MBBS, MD (Medicine), Fellowship in Diabetology',
      medical_registration_no: 'MMC-2012-0948',
      specialty: 'Diabetologist',
      years_of_experience: 11,
      hospital_clinic_name: 'Apex Diabetes Care',
      consultation_fee: 750,
      languages_spoken: ['English', 'Marathi'],
      bio: 'Consultant diabetologist focusing on insulin pump management and lifestyle reversal programs.',
      verification_status: 'pending',
      rating: 5.0,
      total_reviews: 0,
      available_days: ['Monday', 'Thursday'],
    },
  ]);

  const handleApprove = (id: string) => {
    setDoctors(
      doctors.map((d) => (d.id === id ? { ...d, verification_status: 'approved' } : d))
    );
  };

  const handleReject = (id: string) => {
    setDoctors(
      doctors.map((d) => (d.id === id ? { ...d, verification_status: 'rejected' } : d))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          Doctor Credentials Verification &amp; Licensing
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review medical council registration numbers, credentials, and activate public consultation booking.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Practitioner Registry</h2>
          <span className="text-xs text-slate-500">{doctors.length} practitioners registered</span>
        </div>

        <div className="divide-y divide-slate-100">
          {doctors.map((doc) => (
            <div key={doc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  DR
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{doc.full_name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Reg: {doc.medical_registration_no}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 font-medium">{doc.specialty} • {doc.qualifications}</p>
                  <p className="text-xs text-slate-500">{doc.hospital_clinic_name} • {doc.years_of_experience} yrs exp • Fee: ₹{doc.consultation_fee}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${
                  doc.verification_status === 'approved'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : doc.verification_status === 'pending'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {doc.verification_status}
                </span>

                {doc.verification_status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(doc.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Doctor
                    </button>
                    <button
                      onClick={() => handleReject(doc.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
