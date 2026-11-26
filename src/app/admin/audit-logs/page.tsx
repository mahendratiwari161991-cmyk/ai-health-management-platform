'use client';

import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Calendar,
  User,
  Shield,
  Activity,
  Filter,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  classification: 'Confidential' | 'Clinical' | 'Administrative';
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: '2026-11-26 14:10 IST',
    actor: 'Dr. Rajesh Sharma, MD',
    action: 'Accessed Patient Continuous BP Telemetry Records',
    target: 'Patient: Arun Kumar (ID: ...0004)',
    classification: 'Clinical',
  },
  {
    id: 'log-102',
    timestamp: '2026-11-26 13:45 IST',
    actor: 'System Administrator',
    action: 'Verified Doctor Medical Registration MMC-2012-0948',
    target: 'Doctor: Dr. Sanjay Kulkarni',
    classification: 'Administrative',
  },
  {
    id: 'log-103',
    timestamp: '2026-11-25 18:20 IST',
    actor: 'Dr. Rajesh Sharma, MD',
    action: 'Issued & Digitally Signed Prescription Ref #rx-101',
    target: 'Patient: Arun Kumar',
    classification: 'Clinical',
  },
  {
    id: 'log-104',
    timestamp: '2026-11-25 11:30 IST',
    actor: 'Arun Kumar (Patient)',
    action: 'Granted Clinical Telemetry Consent to Dr. Anita Desai',
    target: 'Doctor: Dr. Anita Desai, DM',
    classification: 'Confidential',
  },
  {
    id: 'log-105',
    timestamp: '2026-11-24 09:15 IST',
    actor: 'GlycoPulse AI Engine',
    action: 'Generated 7-Day Indian Diet Plan & Educational Guidance',
    target: 'Patient: Arun Kumar',
    classification: 'Clinical',
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Layers className="w-8 h-8 text-indigo-600" />
          HIPAA &amp; DPDP Clinical Audit Trails
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Immutable audit record of all patient record views, prescription signings, and credential modifications.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Security &amp; Clinical Event Log</h2>
          <span className="text-xs text-slate-500">{logs.length} logged events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Conducted</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.actor}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{log.action}</td>
                  <td className="py-3 px-4 text-slate-500">{log.target}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.classification}
                    </span>
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
