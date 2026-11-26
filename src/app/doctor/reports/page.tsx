'use client';

import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Download,
  Calendar,
  CheckCircle2,
  Stethoscope,
  X,
  User,
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '@/lib/mock-data';
import { MedicalReport } from '@/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DoctorReportsPage() {
  const doctor = DOCTORS_DIRECTORY[0];

  const [reports, setReports] = useState<MedicalReport[]>([
    {
      id: 'rep-201',
      doctor_id: doctor.id,
      patient_id: '00000000-0000-0000-0000-000000000004',
      consultation_date: '2026-11-20',
      chief_complaints: 'Routine review of fasting blood sugar and blood pressure stability.',
      clinical_observations: 'Patient is conscious, alert, and oriented. CVS: S1 S2 heard, no murmurs. Chest clear. No pedal edema.',
      bp_recorded: '126/82 mmHg',
      glucose_recorded: 'Fasting: 104 mg/dL',
      diagnosis: 'Type 2 Diabetes Mellitus under fair control, Essential Stage 1 Hypertension well-managed.',
      treatment_plan: 'Continue Metformin 500mg BD post meals, Telmisartan 40mg OD morning. 30 mins aerobic walking.',
      follow_up_date: '2027-02-20',
      recommendations: 'Repeat HbA1c and Serum Creatinine before next follow-up. Continue low-sodium, high-fiber Indian diet.',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [observations, setObservations] = useState('');
  const [bpValue, setBpValue] = useState('124/82 mmHg');
  const [glucoseValue, setGlucoseValue] = useState('Fasting: 102 mg/dL');
  const [diag, setDiag] = useState('');
  const [plan, setPlan] = useState('');
  const [followUp, setFollowUp] = useState('2027-02-28');
  const [recommendations, setRecommendations] = useState('');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint || !diag || !plan) return;

    const newRep: MedicalReport = {
      id: `rep-${Date.now()}`,
      doctor_id: doctor.id,
      patient_id: '00000000-0000-0000-0000-000000000004',
      consultation_date: new Date().toISOString().split('T')[0],
      chief_complaints: complaint,
      clinical_observations: observations,
      bp_recorded: bpValue,
      glucose_recorded: glucoseValue,
      diagnosis: diag,
      treatment_plan: plan,
      follow_up_date: followUp,
      recommendations,
    };

    setReports([newRep, ...reports]);
    setIsModalOpen(false);
    setComplaint('');
    setDiag('');
    setPlan('');
  };

  const handleDownloadPDF = (rep: MedicalReport) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text(doctor.full_name, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`${doctor.qualifications} | ${doctor.specialty}`, 14, 26);
    doc.text(`Reg No: ${doctor.medical_registration_no} | ${doctor.hospital_clinic_name}`, 14, 32);

    doc.setDrawColor(200);
    doc.line(14, 36, 196, 36);

    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text('CLINICAL CONSULTATION & EVALUATION REPORT', 14, 44);

    doc.setFontSize(10);
    doc.text(`Patient: Arun Kumar | Age: 51, Male | Date: ${rep.consultation_date}`, 14, 52);
    doc.text(`Recorded Vitals: BP: ${rep.bp_recorded} | Glucose: ${rep.glucose_recorded}`, 14, 58);

    autoTable(doc, {
      startY: 64,
      head: [['Clinical Category', 'Consultant Notes & Findings']],
      body: [
        ['Chief Complaints', rep.chief_complaints],
        ['Clinical Observations', rep.clinical_observations || '--'],
        ['Diagnosis', rep.diagnosis],
        ['Treatment & Medication Plan', rep.treatment_plan],
        ['Diet & Lifestyle Advice', rep.recommendations || '--'],
        ['Next Recommended Follow-Up', rep.follow_up_date || 'In 3 Months'],
      ],
      headStyles: { fillColor: [30, 58, 138] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Authorized by: ${doctor.full_name}`, 14, finalY);
    doc.text(`Registration: ${doctor.medical_registration_no}`, 14, finalY + 6);

    doc.save(`Clinical_Report_${rep.id}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-blue-600" />
            Doctor Consultation Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author and export formal clinical summaries, treatment regimens, and follow-up directives.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create Consultation Report
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Report #{rep.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Patient: Arun Kumar • Date: {rep.consultation_date}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Diagnosis: {rep.diagnosis}</p>
              </div>

              <button
                onClick={() => handleDownloadPDF(rep)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-blue-600" />
                Download Formal PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[11px]">Chief Complaints</span>
                <p className="text-slate-600">{rep.chief_complaints}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[11px]">Vitals Observed</span>
                <p className="text-slate-600">BP: {rep.bp_recorded} • {rep.glucose_recorded}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[11px]">Treatment Plan</span>
                <p className="text-slate-600">{rep.treatment_plan}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[11px]">Follow-Up &amp; Recommendations</span>
                <p className="text-slate-600">Follow-up: {rep.follow_up_date} • {rep.recommendations}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Draft Medical Consultation Report
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chief Complaints *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Mild headache in the evenings, regular morning blood sugar checks"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinical Observations</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Conscious, oriented, no pedal edema, normal breath sounds"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">BP Observed</label>
                  <input
                    type="text"
                    value={bpValue}
                    onChange={(e) => setBpValue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Glucose Observed</label>
                  <input
                    type="text"
                    value={glucoseValue}
                    onChange={(e) => setGlucoseValue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Type 2 Diabetes Mellitus under stable control"
                  value={diag}
                  onChange={(e) => setDiag(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Treatment Plan *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Maintain Metformin 500mg BD; increase hydration; avoid excess salt"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Diet Recommendations</label>
                  <input
                    type="text"
                    placeholder="e.g. Low sodium, high fiber millets"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
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
                  Save &amp; Finalize Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
