'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Calendar,
  Lock,
  Share2,
  CheckCircle2,
  X,
  Stethoscope,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MedicalDoc {
  id: string;
  title: string;
  type: 'Doctor Report' | 'Lab Report' | 'Prescription' | 'HbA1c';
  date: string;
  provider: string;
  isSharedWithDoctor: boolean;
}

export default function MedicalRecordsPage() {
  const [documents, setDocuments] = useState<MedicalDoc[]>([
    {
      id: 'doc-1',
      title: 'Quarterly Comprehensive Metabolic Panel & HbA1c',
      type: 'HbA1c',
      date: '2026-10-12',
      provider: 'Dr. Lal PathLabs',
      isSharedWithDoctor: true,
    },
    {
      id: 'doc-2',
      title: 'Digital Prescription - Hypertension & Glycemic Care',
      type: 'Prescription',
      date: '2026-09-10',
      provider: 'Dr. Rajesh Sharma, MD',
      isSharedWithDoctor: true,
    },
    {
      id: 'doc-3',
      title: 'Cardiovascular Risk Assessment & Echo Report',
      type: 'Doctor Report',
      date: '2026-06-18',
      provider: 'Fortis Healthcare',
      isSharedWithDoctor: false,
    },
  ]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<any>('Lab Report');
  const [newProvider, setNewProvider] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newDoc: MedicalDoc = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      type: newType,
      date: new Date().toISOString().split('T')[0],
      provider: newProvider || 'Self Uploaded',
      isSharedWithDoctor: true,
    };

    setDocuments([newDoc, ...documents]);
    setUploadModalOpen(false);
    setNewTitle('');
    setNewProvider('');
  };

  const toggleShare = (id: string) => {
    setDocuments(
      documents.map((d) =>
        d.id === id ? { ...d, isSharedWithDoctor: !d.isSharedWithDoctor } : d
      )
    );
  };

  // Generate Sample PDF Download for the document
  const handleDownloadDoc = (docTitle: string, docType: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('GlycoPulse Clinical Record', 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Title: ${docTitle}`, 14, 30);
    doc.text(`Type: ${docType} | Patient: Arun Kumar`, 14, 38);
    doc.text(`Authorized on: ${new Date().toLocaleDateString('en-IN')}`, 14, 46);

    autoTable(doc, {
      startY: 55,
      head: [['Parameter', 'Observed Value', 'Biological Reference Interval']],
      body: [
        ['HbA1c (Glycosylated Hemoglobin)', '6.8 %', '< 5.7 % Normal; > 6.5 % Diabetes'],
        ['Estimated Average Glucose', '148 mg/dL', '90 - 150 mg/dL'],
        ['Serum Creatinine', '0.9 mg/dL', '0.7 - 1.2 mg/dL'],
        ['Total Cholesterol', '185 mg/dL', '< 200 mg/dL'],
        ['Triglycerides', '160 mg/dL', '< 150 mg/dL'],
      ],
      headStyles: { fillColor: [30, 41, 59] },
    });

    doc.save(`${docTitle.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-blue-600" />
            Medical Records &amp; Diagnostic Vault
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Secure, encrypted repository for doctor consultation reports, lab tests, and digital prescriptions.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-xs transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Health Report
        </button>
      </div>

      {/* DPDP Compliance Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start space-x-3">
        <Lock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Patient Data Protection &amp; Consent:</span> In accordance with the Digital Personal Data Protection framework, your medical records are encrypted. Treating doctors only have access to documents when consent has been granted by you. You may revoke consent at any time.
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {doc.type}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {doc.date}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-2">{doc.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{doc.provider}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => toggleShare(doc.id)}
                className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                  doc.isSharedWithDoctor
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                {doc.isSharedWithDoctor ? 'Shared with Doctor' : 'Private Only'}
              </button>

              <button
                onClick={() => handleDownloadDoc(doc.title, doc.type)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                title="Download PDF"
              >
                <Download className="w-4 h-4 text-blue-600" />
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Diagnostic Report
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lipid Profile &amp; Kidney Function Test"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Document Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="HbA1c">HbA1c Test</option>
                    <option value="Doctor Report">Doctor Report</option>
                    <option value="Prescription">Prescription</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Diagnostic Lab / Clinic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SRL Diagnostics"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Attach PDF or Imaging File
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
