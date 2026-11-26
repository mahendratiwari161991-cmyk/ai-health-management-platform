'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building,
  Award,
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '@/lib/mock-data';

export default function DoctorProfilePage() {
  const doc = DOCTORS_DIRECTORY[0];
  const [name, setName] = useState(doc.full_name);
  const [qualifications, setQualifications] = useState(doc.qualifications);
  const [regNo, setRegNo] = useState(doc.medical_registration_no);
  const [specialty, setSpecialty] = useState(doc.specialty);
  const [experience, setExperience] = useState(doc.years_of_experience);
  const [fee, setFee] = useState(doc.consultation_fee);
  const [hospital, setHospital] = useState(doc.hospital_clinic_name || '');
  const [bio, setBio] = useState(doc.bio || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          Doctor Professional Profile &amp; Clinic Credentials
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage clinical qualifications, hospital affiliations, consultation fees, and verified medical registration.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Doctor credentials and availability saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-bold text-slate-900">1. Medical Qualifications &amp; License</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Approved Practitioner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Medical Registration No (MCI / State Council)
              </label>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-slate-50 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degrees &amp; Qualifications</label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinical Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Years of Experience</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Affiliated Hospital / Clinic</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Professional Bio &amp; Clinical Focus</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            Save Profile Updates
          </button>
        </div>
      </form>
    </div>
  );
}
