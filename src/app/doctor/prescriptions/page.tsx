'use client';

import React, { useState } from 'react';
import {
  Pill,
  PlusCircle,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  X,
  Trash2,
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '@/lib/mock-data';
import { Prescription, PrescriptionItem } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DoctorPrescriptionsPage() {
  const doctor = DOCTORS_DIRECTORY[0]; // Dr. Rajesh Sharma, MD

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'rx-101',
      doctor_id: doctor.id,
      patient_id: '00000000-0000-0000-0000-000000000004',
      doctor_name: doctor.full_name,
      doctor_reg_no: doctor.medical_registration_no,
      patient_name: 'Arun Kumar',
      diagnosis: 'Type 2 Diabetes Mellitus with Essential Hypertension',
      prescribed_date: '2026-11-20',
      special_precautions: 'Monitor fasting blood sugar daily; maintain adequate hydration and sodium restriction (<2.3g/day).',
      is_finalized: true,
      items: [
        {
          medicine_name: 'Metformin Hydrochloride (SR)',
          dosage: '500 mg',
          frequency: 'Twice daily (BD)',
          duration: '90 Days',
          instructions: 'Take immediately after morning and evening meals',
        },
        {
          medicine_name: 'Telmisartan Tablets IP',
          dosage: '40 mg',
          frequency: 'Once daily (OD)',
          duration: '90 Days',
          instructions: 'Take in the morning with water',
        },
        {
          medicine_name: 'Atorvastatin Calcium',
          dosage: '10 mg',
          frequency: 'Once daily (HS)',
          duration: '90 Days',
          instructions: 'Take at bedtime',
        },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('Arun Kumar');
  const [diagnosis, setDiagnosis] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      medicine_name: '',
      dosage: '',
      frequency: 'Twice daily (BD)',
      duration: '30 Days',
      instructions: 'After meals',
    },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        medicine_name: '',
        dosage: '',
        frequency: 'Once daily (OD)',
        duration: '30 Days',
        instructions: 'After meals',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PrescriptionItem, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis || items.length === 0 || !items[0].medicine_name) return;

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      doctor_id: doctor.id,
      patient_id: '00000000-0000-0000-0000-000000000004',
      doctor_name: doctor.full_name,
      doctor_reg_no: doctor.medical_registration_no,
      patient_name: patientName,
      diagnosis,
      prescribed_date: new Date().toISOString().split('T')[0],
      special_precautions: precautions,
      is_finalized: true,
      items,
    };

    setPrescriptions([newRx, ...prescriptions]);
    setIsModalOpen(false);
    setDiagnosis('');
    setPrecautions('');
  };

  // Download PDF Prescription
  const handleDownloadPDF = (rx: Prescription) => {
    const doc = new jsPDF();

    // Doctor Header
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text(rx.doctor_name || doctor.full_name, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`${doctor.qualifications} | ${doctor.specialty}`, 14, 26);
    doc.text(`Reg No: ${rx.doctor_reg_no || doctor.medical_registration_no} | ${doctor.hospital_clinic_name}`, 14, 32);

    doc.setDrawColor(200);
    doc.line(14, 36, 196, 36);

    // Patient & Diagnosis
    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(`Patient: ${rx.patient_name || 'Arun Kumar'} (Age: 51, Male)`, 14, 44);
    doc.text(`Date: ${rx.prescribed_date}`, 150, 44);
    doc.text(`Clinical Diagnosis: ${rx.diagnosis}`, 14, 52);

    // Prescription Items Table
    const tableData = rx.items.map((it, idx) => [
      `${idx + 1}`,
      `${it.medicine_name} (${it.dosage})`,
      it.frequency,
      it.duration,
      it.instructions,
    ]);

    autoTable(doc, {
      startY: 58,
      head: [['#', 'Medicine & Strength', 'Frequency', 'Duration', 'Instructions']],
      body: tableData,
      headStyles: { fillColor: [30, 58, 138] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    if (rx.special_precautions) {
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`Special Clinical Precautions: ${rx.special_precautions}`, 14, finalY);
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Digitally Authorized by: ${rx.doctor_name}`, 14, finalY + 25);
    doc.text(`Medical Council Registration: ${rx.doctor_reg_no}`, 14, finalY + 31);
    doc.text(`GlycoPulse Secure Clinical Record`, 14, finalY + 37);

    doc.save(`Prescription_${rx.id}_${(rx.patient_name || 'Patient').replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Pill className="w-8 h-8 text-blue-600" />
            Digital Prescriptions &amp; Medication Authorization
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative clinical prescriptions issued and finalized exclusively by registered medical practitioners.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Prescription
        </button>
      </div>

      {/* AI Boundary Notice (Requirement: AI must never prescribe medicines) */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl text-xs text-blue-900 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Clinical Sovereignty Guardrail:</span> Prescriptions cannot be drafted, created, or finalized by AI. Every prescription requires human validation by the treating doctor with active registration credentials and digital sign-off.
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-6">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Prescription Ref #{rx.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Patient: {rx.patient_name} • Date: {rx.prescribed_date}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Diagnosis: {rx.diagnosis}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Doctor Finalized
                </span>
                <button
                  onClick={() => handleDownloadPDF(rx)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Prescribed Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Medicine &amp; Strength</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rx.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{it.medicine_name} ({it.dosage})</td>
                      <td className="py-2.5 px-3">{it.frequency}</td>
                      <td className="py-2.5 px-3">{it.duration}</td>
                      <td className="py-2.5 px-3 text-slate-600">{it.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rx.special_precautions && (
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 italic">
                <strong>Precautions:</strong> {rx.special_precautions}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Create Prescription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  Issue Clinical Prescription
                </h3>
                <p className="text-xs text-slate-500">Dr. {doctor.full_name} • MCI Reg: {doctor.medical_registration_no}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patient</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinical Diagnosis *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uncontrolled Type 2 Diabetes, Stage 1 HTN"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Dynamic Items */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase">Prescribed Medicines</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Another Medicine
                  </button>
                </div>

                {items.map((it, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Medicine #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-600 text-xs hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Name (e.g. Glimepiride)"
                        value={it.medicine_name}
                        onChange={(e) => handleItemChange(idx, 'medicine_name', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Dosage (e.g. 1mg)"
                        value={it.dosage}
                        onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Freq (e.g. OD Before Breakfast)"
                        value={it.frequency}
                        onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 30 Days)"
                        value={it.duration}
                        onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Special Clinical Precautions / Diet Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Check for hypoglycemic symptoms; re-test HbA1c in 3 months"
                  value={precautions}
                  onChange={(e) => setPrecautions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
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
                  Authorize &amp; Finalize Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
