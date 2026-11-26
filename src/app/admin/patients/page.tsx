'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
} from 'lucide-react';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Arun Kumar',
      email: 'patient.arun@example.com',
      phone: '+91 9876543213',
      diabetesType: 'Type 2',
      registeredDate: '2026-08-01',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      name: 'Meena Sharma',
      email: 'meena.sharma@example.com',
      phone: '+91 9876543217',
      diabetesType: 'Pre-diabetes',
      registeredDate: '2026-09-15',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      name: 'Rohan Verma',
      email: 'rohan.v@example.com',
      phone: '+91 9876543218',
      diabetesType: 'Type 1',
      registeredDate: '2026-10-05',
      isActive: true,
    },
  ]);

  const toggleStatus = (id: string) => {
    setPatients(
      patients.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Users className="w-8 h-8 text-cyan-600" />
          Patient Accounts &amp; Telemetry Registry
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review registered patient profiles, diabetes classifications, and account statuses.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Registered Patient Directory</h2>
          <span className="text-xs text-slate-500">{patients.length} patient accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{p.email}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">{p.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {p.diabetesType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{p.registeredDate}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      p.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {p.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(p.id)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {p.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
