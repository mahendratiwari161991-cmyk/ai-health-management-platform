'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  FileText,
  User,
  Heart,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { INITIAL_BP_READINGS, INITIAL_GLUCOSE_READINGS, INITIAL_MEDICATIONS } from '@/lib/mock-data';

function VideoCallContent() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') || 'AIHealth-Consult-Room-Private';

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState(false);

  // In production, Jitsi / WebRTC domain is configurable via NEXT_PUBLIC_JITSI_DOMAIN
  const jitsiDomain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'meet.jit.si';
  const meetingUrl = `https://${jitsiDomain}/${encodeURIComponent(room)}#config.prejoinPageEnabled=false&config.startWithAudioMuted=${isMuted}&config.startWithVideoMuted=${isVideoOff}`;

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotes(true);
    setTimeout(() => setSavedNotes(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            End-to-End Encrypted Teleconsultation Room
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Video className="w-8 h-8 text-indigo-600" />
            Clinical Video Consultation
          </h1>
          <p className="text-xs text-slate-500">
            Secure Session ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{room}</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-xl border transition-all ${
              isMuted
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-xl border transition-all ${
              isVideoOff
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setCallEnded(true)}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-3 rounded-xl text-xs shadow-xs transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            End Call
          </button>
        </div>
      </div>

      {callEnded ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Consultation Completed</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            The video session has concluded. Your doctor has been prompted to upload final clinical notes and authorized prescriptions to your vault.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setCallEnded(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Rejoin Room
            </button>
            <a
              href="/patient/dashboard"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
            >
              Back to Patient Dashboard
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Frame */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 min-h-[500px] flex flex-col">
            <div className="p-3 bg-slate-950/80 text-white text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Consultation in Progress
              </span>
              <span className="text-slate-400">Dr. Rajesh Sharma &amp; Arun Kumar</span>
            </div>

            <iframe
              src={meetingUrl}
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full flex-1 border-0"
              title="Doctor Video Consultation Room"
            />
          </div>

          {/* Side Drawer: Live Patient Vitals Reference & Consultation Notes */}
          <div className="space-y-6">
            {/* Quick Vitals for Doctor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                Live Patient Telemetry Reference
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                  <span className="text-slate-500 block">Today BP</span>
                  <span className="font-extrabold text-slate-900 text-sm">124/82 mmHg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-100">
                  <span className="text-slate-500 block">Fasting Sugar</span>
                  <span className="font-extrabold text-slate-900 text-sm">102 mg/dL</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <div><strong>Patient:</strong> Arun Kumar (51 yrs, M)</div>
                <div><strong>Current Meds:</strong> Metformin 500mg, Telmisartan 40mg</div>
                <div><strong>Allergies:</strong> Penicillin</div>
              </div>
            </div>

            {/* In-Call Consultation Notes Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Consultation Observations &amp; Advice
              </h3>

              {savedNotes && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Notes saved to medical record.
                </div>
              )}

              <form onSubmit={handleSaveNotes} className="space-y-3">
                <textarea
                  rows={4}
                  placeholder="Record immediate consultation remarks, patient reported compliance, symptoms..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
                >
                  Save In-Call Notes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Initializing encrypted teleconsultation room...</div>}>
      <VideoCallContent />
    </Suspense>
  );
}
