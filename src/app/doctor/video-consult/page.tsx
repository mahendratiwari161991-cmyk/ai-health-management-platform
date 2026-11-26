'use client';

import React, { Suspense } from 'react';
import VideoCallPage from '@/app/patient/video-call/page';

export default function DoctorVideoConsultRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Connecting to secure video room...</div>}>
      <VideoCallPage />
    </Suspense>
  );
}
