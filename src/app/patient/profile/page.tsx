'use client';

import React, { useState } from 'react';
import {
  User,
  Heart,
  Droplets,
  Phone,
  Shield,
  Save,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PatientProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || 'Arun Kumar');
  const [email, setEmail] = useState(user?.email || 'patient.arun@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543213');
  const [dob, setDob] = useState('1975-06-15');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('172');
  const [weight, setWeight] = useState('78.5');
  const [diabetesType, setDiabetesType] = useState('Type 2');
  const [allergies, setAllergies] = useState('Penicillin');
  const [conditions, setConditions] = useState('Hypertension, Dyslipidemia');
  const [emergencyName, setEmergencyName] = useState('Sunita Kumar');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 9876543299');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ full_name: fullName, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <User className="w-8 h-8 text-blue-600" />
          Patient Health Profile &amp; Clinical Targets
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Keep your medical history, diabetes classification, and emergency contacts updated.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Your profile and clinical targets have been saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Personal Demographics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Medical Profile &amp; Diabetes Classification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Diabetes Classification
              </label>
              <select
                value={diabetesType}
                onChange={(e) => setDiabetesType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Type 1">Type 1 Diabetes</option>
                <option value="Type 2">Type 2 Diabetes</option>
                <option value="Gestational">Gestational Diabetes</option>
                <option value="Pre-diabetes">Pre-diabetes</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Known Allergies
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa drugs"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Existing Conditions
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Dyslipidemia"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-600" />
            3. Emergency Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contact Name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contact Mobile
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Relationship
              </label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
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
            Save Profile &amp; Health Settings
          </button>
        </div>
      </form>
    </div>
  );
}
