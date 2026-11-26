'use client';

import React, { useState } from 'react';
import {
  Bot,
  Save,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Cpu,
} from 'lucide-react';

export default function AdminAIManagementPage() {
  const [model, setModel] = useState('gpt-4o-mini');
  const [emergencySystolic, setEmergencySystolic] = useState('180');
  const [emergencyDiastolic, setEmergencyDiastolic] = useState('120');
  const [hypoGlucose, setHypoGlucose] = useState('70');
  const [hyperGlucose, setHyperGlucose] = useState('300');
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
          <Bot className="w-8 h-8 text-amber-500" />
          AI Engine Safety &amp; Clinical Threshold Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure model parameters, emergency escalations, and strict non-diagnostic system constraints.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          AI safety settings and emergency triggers saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Core Model Provider Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Active Provider Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              >
                <option value="gpt-4o-mini">OpenAI GPT-4o-mini (Recommended for speed &amp; cost)</option>
                <option value="gpt-4o">OpenAI GPT-4o (High-context clinical analysis)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sampling Temperature
              </label>
              <input
                type="text"
                disabled
                value="0.3 (Strict Clinical Consistency)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            2. Hard Clinical Escalation Thresholds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Critical Systolic BP Limit (mmHg)
              </label>
              <input
                type="number"
                value={emergencySystolic}
                onChange={(e) => setEmergencySystolic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Critical Diastolic BP Limit (mmHg)
              </label>
              <input
                type="number"
                value={emergencyDiastolic}
                onChange={(e) => setEmergencyDiastolic(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hypoglycemia Emergency Limit (mg/dL)
              </label>
              <input
                type="number"
                value={hypoGlucose}
                onChange={(e) => setHypoGlucose(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hyperglycemia Emergency Limit (mg/dL)
              </label>
              <input
                type="number"
                value={hyperGlucose}
                onChange={(e) => setHyperGlucose(e.target.value)}
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
            Save AI Parameters
          </button>
        </div>
      </form>
    </div>
  );
}
