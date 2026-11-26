'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Activity,
  Heart,
  Droplets,
  Calendar,
  Video,
  FileText,
  User,
  Shield,
  Bot,
  Pill,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export default function Navigation() {
  const { user, role, loginAsDemoUser, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const patientNav: NavItem[] = [
    { label: 'Dashboard', href: '/patient/dashboard', icon: Activity },
    { label: 'BP Tracking', href: '/patient/bp-tracking', icon: Heart },
    { label: 'Sugar Tracking', href: '/patient/glucose-tracking', icon: Droplets },
    { label: 'AI Assistant', href: '/patient/ai-assistant', icon: Bot, badge: 'AI' },
    { label: 'Diet Planner', href: '/patient/diet-planner', icon: Sparkles },
    { label: 'Medications', href: '/patient/medications', icon: Pill },
    { label: 'Find Doctors', href: '/patient/doctors', icon: Stethoscope },
    { label: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { label: 'Medical Records', href: '/patient/records', icon: FileText },
    { label: 'Profile', href: '/patient/profile', icon: User },
  ];

  const doctorNav: NavItem[] = [
    { label: 'Doctor Dashboard', href: '/doctor/dashboard', icon: Activity },
    { label: 'My Patients', href: '/doctor/patients', icon: User },
    { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { label: 'Video Consultations', href: '/doctor/video-consult', icon: Video },
    { label: 'Prescriptions', href: '/doctor/prescriptions', icon: Pill },
    { label: 'Medical Reports', href: '/doctor/reports', icon: FileText },
    { label: 'Doctor Profile', href: '/doctor/profile', icon: Stethoscope },
  ];

  const adminNav: NavItem[] = [
    { label: 'Admin Dashboard', href: '/admin/dashboard', icon: Activity },
    { label: 'Doctor Verifications', href: '/admin/doctor-verifications', icon: Shield },
    { label: 'All Patients', href: '/admin/patients', icon: User },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: Layers },
    { label: 'AI Safety & Config', href: '/admin/ai-management', icon: Bot },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'doctor' ? doctorNav : patientNav;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Heart className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  GlycoPulse <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800">AI Health</span>
                </span>
                <span className="block text-[11px] text-slate-500 font-medium">BP & Diabetes Management</span>
              </div>
            </Link>
          </div>

          {/* Role Switcher Pill for Testing / Demonstration */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200">
            <span className="px-2 text-slate-500">Role View:</span>
            <button
              onClick={() => loginAsDemoUser('patient')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                role === 'patient' ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => loginAsDemoUser('doctor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                role === 'doctor' ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor
            </button>
            <button
              onClick={() => loginAsDemoUser('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                role === 'admin' ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-800 leading-snug">{user?.full_name || 'Guest User'}</div>
              <div className="text-xs text-slate-500 capitalize">{role} Mode</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
              {user?.full_name ? user.full_name[0] : 'U'}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar for Desktop */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-1.5 min-w-max">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-400 text-slate-900">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch View Role</span>
            <div className="flex space-x-1">
              {(['patient', 'doctor', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => loginAsDemoUser(r)}
                  className={`text-xs px-2.5 py-1 rounded-md capitalize font-medium ${
                    role === r ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-400 text-slate-900">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
