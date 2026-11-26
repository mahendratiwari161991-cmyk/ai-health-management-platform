'use client';

import React, { useState } from 'react';
import {
  Droplets,
  PlusCircle,
  Download,
  Trash2,
  Calendar,
  Clock,
  Activity,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  X,
  Repeat,
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
import { INITIAL_GLUCOSE_READINGS } from '@/lib/mock-data';
import { classifyGlucose, convertGlucose } from '@/lib/health-utils';
import { GlucoseReading } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function GlucoseTrackingPage() {
  const [readings, setReadings] = useState<GlucoseReading[]>(INITIAL_GLUCOSE_READINGS);
  const [currentUnit, setCurrentUnit] = useState<'mg_dL' | 'mmol_L'>('mg_dL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [glucoseVal, setGlucoseVal] = useState('');
  const [measurementType, setMeasurementType] = useState<'fasting' | 'before_meal' | 'post_meal_1h' | 'post_meal_2h' | 'random' | 'bedtime'>('fasting');
  const [mealDetails, setMealDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('2026-11-26');
  const [time, setTime] = useState('08:00');

  // Toggle Display Units
  const toggleUnit = () => {
    setCurrentUnit(currentUnit === 'mg_dL' ? 'mmol_L' : 'mg_dL');
  };

  // Add Reading
  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!glucoseVal) return;

    const val = parseFloat(glucoseVal);
    const measuredDate = new Date(`${date}T${time}:00Z`).toISOString();

    const newReading: GlucoseReading = {
      id: `glu-${Date.now()}`,
      patient_id: '00000000-0000-0000-0000-000000000004',
      measured_at: measuredDate,
      glucose_value: currentUnit === 'mmol_L' ? convertGlucose(val, 'mmol_L', 'mg_dL') : val,
      unit: 'mg_dL',
      measurement_type: measurementType,
      meal_details: mealDetails,
      notes: notes,
      is_critical: val < 70 || val >= 300,
    };

    setReadings([newReading, ...readings]);
    setIsModalOpen(false);
    setGlucoseVal('');
    setMealDetails('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this glucose reading?')) {
      setReadings(readings.filter((r) => r.id !== id));
    }
  };

  // Separate clinical averages
  const fastingOnly = readings.filter((r) => r.measurement_type === 'fasting');
  const postMealOnly = readings.filter((r) => r.measurement_type.startsWith('post_meal'));
  const randomOnly = readings.filter((r) => r.measurement_type === 'random' || r.measurement_type === 'bedtime');

  const avgFasting = fastingOnly.length
    ? Math.round(fastingOnly.reduce((a, b) => a + b.glucose_value, 0) / fastingOnly.length)
    : 0;

  const avgPostMeal = postMealOnly.length
    ? Math.round(postMealOnly.reduce((a, b) => a + b.glucose_value, 0) / postMealOnly.length)
    : 0;

  // Chart data
  const chartData = [...readings].reverse().map((r) => ({
    date: new Date(r.measured_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    fasting: r.measurement_type === 'fasting' ? r.glucose_value : null,
    postMeal: r.measurement_type.startsWith('post_meal') ? r.glucose_value : null,
    random: r.measurement_type === 'random' ? r.glucose_value : null,
  }));

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Date,Glucose Value (mg/dL),Measurement Type,Classification,Meal Details,Notes\n'];
    const rows = readings.map((r) => {
      const cls = classifyGlucose(r.glucose_value, r.measurement_type, 'mg_dL');
      return `"${new Date(r.measured_at).toLocaleString()}",${r.glucose_value},"${r.measurement_type}","${cls.category}","${r.meal_details || ''}","${r.notes || ''}"\n`;
    });
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Glucose_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Blood Glucose Clinical Log Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Patient: Arun Kumar | Target Fasting: 70-100 mg/dL | Target Post-Meal: <140 mg/dL', 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 34);

    const tableData = readings.map((r) => {
      const cls = classifyGlucose(r.glucose_value, r.measurement_type, 'mg_dL');
      return [
        new Date(r.measured_at).toLocaleDateString('en-IN'),
        `${r.glucose_value} mg/dL`,
        r.measurement_type.replace('_', ' '),
        cls.category,
        r.meal_details || '--',
        r.notes || '--',
      ];
    });

    autoTable(doc, {
      startY: 42,
      head: [['Date', 'Glucose Value', 'Type', 'Clinical Status', 'Meal Details', 'Notes']],
      body: tableData,
      headStyles: { fillColor: [8, 145, 178] },
      alternateRowStyles: { fillColor: [240, 253, 250] },
    });

    doc.save(`Glucose_Clinical_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Droplets className="w-8 h-8 text-cyan-600" />
            Blood Sugar &amp; Glucose Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Clinical tracking strictly distinguishing fasting, pre-meal, and 2-hr post-meal readings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleUnit}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-colors border border-slate-300"
          >
            <Repeat className="w-3.5 h-3.5" />
            Unit: {currentUnit === 'mg_dL' ? 'mg/dL' : 'mmol/L'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Log Blood Sugar
          </button>
          <button
            onClick={exportToPDF}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3.5 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            PDF
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3.5 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            CSV
          </button>
        </div>
      </div>

      {/* Clinical Segregated Averages Notice (Requirement: Never combine fasting and post-meal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Fasting Glucose</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Goal: 70-100</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {currentUnit === 'mg_dL' ? `${avgFasting} mg/dL` : `${convertGlucose(avgFasting, 'mg_dL', 'mmol_L')} mmol/L`}
          </div>
          <p className="mt-1 text-xs text-slate-500">Separately calculated across {fastingOnly.length} morning baseline tests</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Post-Meal (2h)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">Goal: &lt;140</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {currentUnit === 'mg_dL' ? `${avgPostMeal} mg/dL` : `${convertGlucose(avgPostMeal, 'mg_dL', 'mmol_L')} mmol/L`}
          </div>
          <p className="mt-1 text-xs text-slate-500">Post-prandial glycemic response across {postMealOnly.length} meals</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Average HbA1c</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Goal: &lt;7.0%</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            6.8%
          </div>
          <p className="mt-1 text-xs text-slate-500">Verified via clinical laboratory panel on 12-Oct-2026</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Blood Sugar Progression Graph</h2>
        <p className="text-xs text-slate-500 mb-4">
          Isolated Fasting curve (teal) vs Post-Meal glycemic curves (indigo)
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[70, 200]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Line
                connectNulls
                type="monotone"
                dataKey="fasting"
                name="Fasting Glucose"
                stroke="#0891b2"
                strokeWidth={2.5}
                dot={{ r: 5 }}
              />
              <Line
                connectNulls
                type="monotone"
                dataKey="postMeal"
                name="2-Hr Post Meal"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recorded Glucose Sessions</h2>
          <span className="text-xs text-slate-500">{readings.length} entries total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Glucose Reading</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Meal Details</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {readings.map((r) => {
                const cls = classifyGlucose(r.glucose_value, r.measurement_type, 'mg_dL');
                const displayValue = currentUnit === 'mg_dL'
                  ? `${r.glucose_value} mg/dL`
                  : `${convertGlucose(r.glucose_value, 'mg_dL', 'mmol_L')} mmol/L`;

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-medium text-slate-600">
                      {new Date(r.measured_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(r.measured_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{displayValue}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold capitalize text-slate-700 px-2 py-0.5 rounded-md bg-slate-100">
                        {r.measurement_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${cls.bgLight} ${cls.color}`}>
                        {cls.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                      {r.meal_details || '--'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                      {r.notes || '--'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete reading"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-600" />
                Record Blood Sugar Level
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReading} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Glucose Value ({currentUnit === 'mg_dL' ? 'mg/dL' : 'mmol/L'}) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder={currentUnit === 'mg_dL' ? 'e.g. 105' : 'e.g. 5.8'}
                    value={glucoseVal}
                    onChange={(e) => setGlucoseVal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Measurement Timing *
                  </label>
                  <select
                    value={measurementType}
                    onChange={(e) => setMeasurementType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="fasting">Fasting (Overnight 8-10h)</option>
                    <option value="before_meal">Before Meal (Pre-prandial)</option>
                    <option value="post_meal_1h">1-Hour Post Meal</option>
                    <option value="post_meal_2h">2-Hour Post Meal</option>
                    <option value="random">Random / Daytime</option>
                    <option value="bedtime">Bedtime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Meal / Food Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 multigrain rotis, dal tadka, cucumber salad"
                  value={mealDetails}
                  onChange={(e) => setMealDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Observations / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Felt slight dizziness, took 15 mins after brisk walk"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
                >
                  Save Sugar Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
