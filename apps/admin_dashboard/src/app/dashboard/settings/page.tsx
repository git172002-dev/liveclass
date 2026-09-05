"use client";

import { useState } from "react";
import {
  Settings,
  Database,
  Cloud,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Infrastructure & Settings</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Verify backend connectivity, Cloudflare R2 bucket state, and production parameters.
        </p>
      </div>

      {/* Backend Status Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Supabase Backend & PostgreSQL</h3>
              <p className="text-xs text-slate-400">Auth, Row Level Security, Edge Functions</p>
            </div>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
              isSupabaseConfigured
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}
          >
            {isSupabaseConfigured ? "Connected" : "Running on Local Seed / Mock Engine"}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The database schema includes 9 core tables (`students`, `courses`, `lessons`, `plans`, `plan_courses`, `subscriptions`, `student_course_access`, `watch_progress`, `admin_users`) with strict RLS policies enabled.
        </p>
      </div>

      {/* Cloudflare R2 Object Storage Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cloudflare R2 Object Storage</h3>
              <p className="text-xs text-slate-400">Zero-Egress Fee Video Hosting & S3 Presigned URLs</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            S3-Compatible V1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Bucket Name</span>
            <span className="font-mono text-cyan-300">edtech-videos-prod</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">URL Expiry (TTL)</span>
            <span className="font-mono text-cyan-300">900 Seconds (15 mins)</span>
          </div>
        </div>
      </div>

      {/* Deployment & Architecture Specs */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Security & Deployment Principles</span>
        </h3>
        <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
          <li>Pre-authorized student OTP login prevents arbitrary public accounts.</li>
          <li>All student course access is verified by Supabase Edge Functions before generating presigned video URLs.</li>
          <li>Next.js Admin Dashboard is optimized for deployment on Vercel with zero cold starts.</li>
          <li>No credentials or API secrets are stored in Git; configurations use `.env` files.</li>
        </ul>
      </div>
    </div>
  );
}
