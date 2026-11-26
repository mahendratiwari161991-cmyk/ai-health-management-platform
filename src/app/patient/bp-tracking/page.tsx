'use client';

import React, { useState } from 'react';
import {
  Heart,
  PlusCircle,
  Download,
  Trash2,
  AlertTriangle,
  Calendar,
  Clock,
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  X,
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
import { INITIAL_BP_READINGS } from '@/lib/mock-data';
import { classifyBP } from '@/lib/health-utils';
import { BPReading } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BPTrackingPage() {
  const [readings, setReadings] = useState<BPReading[]>(INITIAL_BP_READINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [position, setPosition] = useState('Sitting');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('2026-11-26');
  const [time, setTime] = useState('08:00');

  // Add Reading
  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systolic || !diastolic) return;

    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    const pul = pulse ? parseInt(pulse, 10) : undefined;
    const measuredDate = new Date(`${date}T${time}:00Z`).toISOString();

    const newReading: BPReading = {
      id: `bp-${Date.now()}`,
      patient_id: '00000000-0000-0000-0000-000000000004',
      measured_at: measuredDate,
      systolic: sys,
      diastolic: dia,
      pulse: pul,
      measurement_position: position,
      notes: notes,
      is_critical: sys >= 180 || dia >= 120,
    };

    setReadings([newReading, ...readings]);
    setIsModalOpen(false);
    // Reset Form
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setNotes('');
  };

  // Delete Reading with Confirmation
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this BP entry? This action cannot be undone.')) {
      setReadings(readings.filter((r) => r.id !== id));
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date & Time,Systolic (mmHg),Diastolic (mmHg),Pulse (bpm),Position,Category,Notes\n'];
    const rows = readings.map((r) => {
      const classification = classifyBP(r.systolic, r.diastolic);
      return `"${new Date(r.measured_at).toLocaleString()}",${r.systolic},${r.diastolic},${r.pulse || ''},"${r.measurement_position || ''}","${classification.category}","${r.notes || ''}"\n`;
    });
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BP_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Blood Pressure Clinical Log Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Patient: Arun Kumar | DOB: 15-Jun-1975 | Medical Record: GlycoPulse AI', 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 34);

    const tableData = readings.map((r) => {
      const cls = classifyBP(r.systolic, r.diastolic);
      return [
        new Date(r.measured_at).toLocaleDateString('en-IN'),
        `${r.systolic}/${r.diastolic}`,
        r.pulse ? `${r.pulse} bpm` : '--',
        cls.category,
        r.measurement_position || 'Sitting',
        r.notes || 'None',
      ];
    });

    autoTable(doc, {
      startY: 42,
      head: [['Date', 'BP (mmHg)', 'Pulse', 'Clinical Status', 'Position', 'Notes']],
      body: tableData,
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`BP_Clinical_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Metrics
  const avgSys = Math.round(readings.reduce((a, b) => a + b.systolic, 0) / (readings.length || 1));
  const avgDia = Math.round(readings.reduce((a, b) => a + b.diastolic, 0) / (readings.length || 1));
  const chartData = [...readings].reverse().map((r) => ({
    date: new Date(r.measured_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    systolic: r.systolic,
    diastolic: r.diastolic,
    pulse: r.pulse,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Heart className="w-8 h-8 text-rose-600" />
            Blood Pressure Monitor &amp; History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Record, track systolic/diastolic trends, and download clinical logs for your doctor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add BP Reading
          </button>
          <button
            onClick={exportToPDF}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3.5 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            Download PDF
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-3.5 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Average & Target Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Average Blood Pressure</span>
            <div className="text-2xl font-extrabold text-slate-900">{avgSys}/{avgDia} <span className="text-xs font-medium text-slate-500">mmHg</span></div>
            <span className="text-xs text-slate-500">Based on {readings.length} total entries</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Target Range (Hypertension Goal)</span>
            <div className="text-2xl font-extrabold text-emerald-700">&lt; 130 / 80 <span className="text-xs font-medium text-slate-500">mmHg</span></div>
            <span className="text-xs text-slate-500">Customized by Dr. Rajesh Sharma</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Critical Alerts Threshold</span>
            <div className="text-2xl font-extrabold text-rose-700">&ge; 180 / 120 <span className="text-xs font-medium text-slate-500">mmHg</span></div>
            <span className="text-xs text-slate-500">Immediate emergency notification</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Blood Pressure Trend Analysis</h2>
        <p className="text-xs text-slate-500 mb-4">Systolic (top red curve) and Diastolic (bottom blue curve) over time</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[60, 160]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Line type="monotone" dataKey="systolic" name="Systolic (mmHg)" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="diastolic" name="Diastolic (mmHg)" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Historical Blood Pressure Records</h2>
          <span className="text-xs text-slate-500">{readings.length} readings recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">BP (Systolic / Diastolic)</th>
                <th className="py-3 px-4">Pulse</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {readings.map((r) => {
                const cls = classifyBP(r.systolic, r.diastolic);
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
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      {r.systolic}/{r.diastolic} <span className="text-xs font-normal text-slate-500">mmHg</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                      {r.pulse ? `${r.pulse} bpm` : '--'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${cls.bgLight} ${cls.color}`}>
                        {cls.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 capitalize">
                      {r.measurement_position || 'Sitting'}
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
                <Heart className="w-5 h-5 text-rose-600" />
                Record Blood Pressure Reading
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
                    Systolic (mmHg) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 120"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-400">Target: 90-129</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Diastolic (mmHg) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 80"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-400">Target: 60-84</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pulse / Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 72"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Sitting">Sitting (Standard)</option>
                    <option value="Lying Down">Lying Down</option>
                    <option value="Standing">Standing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notes &amp; Context (Stress, Post-Exercise, etc.)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Taken 15 minutes after waking up, relaxed"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
                >
                  Save BP Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
