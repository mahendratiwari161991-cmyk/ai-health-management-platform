'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { DOCTORS_DIRECTORY } from '@/lib/mock-data';
import { DoctorProfile } from '@/types';
import Link from 'next/link';

export default function DoctorDirectoryPage() {
  const [doctors] = useState<DoctorProfile[]>(DOCTORS_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState('2026-11-28');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [consultType, setConsultType] = useState<'video' | 'clinic'>('video');
  const [complaint, setComplaint] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filtered Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital_clinic_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDoctor(null);
      setComplaint('');
    }, 2500);
  };

  const specialties = ['All', 'Diabetologist', 'Cardiologist', 'General Physician', 'Nutritionist'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          Find Verified Doctors &amp; Specialists
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect with certified diabetologists, cardiologists, and registered dietitians for clinic or video consultations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSpecialty === spec
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xl shrink-0">
                {doc.full_name[4] || doc.full_name[0]}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{doc.full_name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                    {doc.rating} ({doc.total_reviews})
                  </div>
                </div>

                <p className="text-xs font-semibold text-blue-700 mt-0.5">{doc.specialty}</p>
                <p className="text-xs text-slate-500">{doc.qualifications}</p>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {doc.hospital_clinic_name} • {doc.years_of_experience} yrs exp
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {doc.bio}
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
                <span className="text-base font-extrabold text-slate-900">₹{doc.consultation_fee}</span>
              </div>

              <button
                onClick={() => setBookingDoctor(doc)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Book Appointment
              </h3>
              <button
                onClick={() => setBookingDoctor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-600">
                  Your appointment with {bookingDoctor.full_name} is confirmed for {selectedDate} at {selectedSlot}. A secure video room link has been generated.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="mt-4 space-y-4">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">{bookingDoctor.full_name}</h4>
                    <p className="text-xs text-blue-700">{bookingDoctor.specialty} • Fee: ₹{bookingDoctor.consultation_fee}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-white text-blue-800 border border-blue-200">
                    Reg: {bookingDoctor.medical_registration_no}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Consultation Medium
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConsultType('video')}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 ${
                        consultType === 'video'
                          ? 'border-blue-600 bg-blue-50/50 text-blue-800'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <Video className="w-4 h-4 text-blue-600" />
                      Video Consultation
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('clinic')}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 ${
                        consultType === 'clinic'
                          ? 'border-blue-600 bg-blue-50/50 text-blue-800'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-slate-600" />
                      Clinic Visit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slot</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                      <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                      <option value="04:00 PM">04:00 PM - 04:30 PM</option>
                      <option value="05:30 PM">05:30 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Chief Health Complaints / Symptoms
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Need evaluation for blood pressure fluctuation and reviewing my Metformin schedule"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingDoctor(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
                  >
                    Confirm Booking (₹{bookingDoctor.consultation_fee})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
