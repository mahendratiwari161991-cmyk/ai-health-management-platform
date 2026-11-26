'use client';

import React, { useState } from 'react';
import {
  Pill,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  X,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { INITIAL_MEDICATIONS } from '@/lib/mock-data';
import { Medication } from '@/types';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [timing, setTiming] = useState<string[]>(['Morning']);
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState('2026-11-26');

  const handleToggleTiming = (t: string) => {
    if (timing.includes(t)) {
      setTiming(timing.filter((item) => item !== t));
    } else {
      setTiming([...timing, t]);
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      patient_id: '00000000-0000-0000-0000-000000000004',
      name,
      dosage,
      frequency,
      timing: timing.length > 0 ? timing : ['Morning'],
      instructions: instructions || 'Take as advised by prescribing doctor',
      start_date: startDate,
      is_active: true,
    };

    setMedications([...medications, newMed]);
    setIsModalOpen(false);
    setName('');
    setDosage('');
    setInstructions('');
  };

  const toggleMedicationActive = (id: string) => {
    setMedications(
      medications.map((m) => (m.id === id ? { ...m, is_active: !m.is_active } : m))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Pill className="w-8 h-8 text-indigo-600" />
            Medication Schedules &amp; Reminders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track active doctor-prescribed medications, daily timings, and adherence logs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Prescribed Medicine
        </button>
      </div>

      {/* Critical Medical Disclaimer (Requirement: AI or patient must not self-adjust prescription drugs) */}
      <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-xl flex items-start space-x-3 text-amber-900 text-xs shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Important Prescription Warning:</span> Never start, stop, or adjust prescription medicines or dosages independently or based on AI recommendations. Any changes to anti-hypertensives, oral hypoglycemic agents, or insulin must be authorized by your treating doctor.
        </div>
      </div>

      {/* Daily Timing Schedules (Morning / Afternoon / Evening / Bedtime) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Morning Slot
            </span>
            <span className="text-[11px] text-slate-500">8:00 AM - 9:00 AM</span>
          </div>
          <div className="space-y-2">
            {medications
              .filter((m) => m.timing.includes('Morning') && m.is_active)
              .map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{m.name} ({m.dosage})</h4>
                    <span className="text-xs text-slate-500">{m.instructions}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800">
                    Taken
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-blue-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Evening Slot
            </span>
            <span className="text-[11px] text-slate-500">6:00 PM - 7:00 PM</span>
          </div>
          <div className="space-y-2">
            {medications
              .filter((m) => m.timing.includes('Evening') && m.is_active)
              .map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{m.name} ({m.dosage})</h4>
                    <span className="text-xs text-slate-500">{m.instructions}</span>
                  </div>
                  <button className="text-xs px-2.5 py-1 rounded-md font-bold bg-blue-600 text-white hover:bg-blue-700">
                    Mark Taken
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-indigo-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Bedtime Slot
            </span>
            <span className="text-[11px] text-slate-500">10:00 PM</span>
          </div>
          <div className="space-y-2">
            {medications
              .filter((m) => m.timing.includes('Bedtime') && m.is_active)
              .map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{m.name} ({m.dosage})</h4>
                    <span className="text-xs text-slate-500">{m.instructions}</span>
                  </div>
                  <button className="text-xs px-2.5 py-1 rounded-md font-bold bg-slate-200 text-slate-800 hover:bg-slate-300">
                    Pending
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* All Active Medications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Current Prescribed Regimen</h2>
          <span className="text-xs text-slate-500">{medications.length} medicines listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Medicine Name</th>
                <th className="py-3 px-4">Dosage</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Schedule Slots</th>
                <th className="py-3 px-4">Instructions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medications.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">{m.dosage}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">{m.frequency}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {m.timing.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs">{m.instructions}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        m.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.is_active ? 'Active' : 'Completed'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleMedicationActive(m.id)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {m.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600" />
                Add Prescribed Medicine
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedication} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metformin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Daily Intake Slots
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Morning', 'Afternoon', 'Evening', 'Bedtime'].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => handleToggleTiming(slot)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        timing.includes(slot)
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Doctor's Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Take immediately after breakfast"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
