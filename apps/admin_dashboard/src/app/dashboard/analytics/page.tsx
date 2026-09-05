"use client";

import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Eye,
  Award,
} from "lucide-react";
import { INITIAL_COURSES, INITIAL_STUDENTS } from "@/lib/mockData";

export default function AnalyticsPage() {
  const engagementMetrics = [
    {
      course: "Physics Class 12: Electromagnetism & Wave Optics",
      completionRate: "78%",
      watchHours: "312 hrs",
      activeViewers: 84,
    },
    {
      course: "Chemistry Class 12: Chemical Kinetics",
      completionRate: "64%",
      watchHours: "198 hrs",
      activeViewers: 62,
    },
    {
      course: "Mathematics Class 12: Advanced Calculus",
      completionRate: "82%",
      watchHours: "245 hrs",
      activeViewers: 71,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Learning Analytics & Engagement</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Focused V1 metrics tracking lecture completion rates, active viewers, and student watch duration.
        </p>
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Average Completion Rate</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">74.6%</p>
          <p className="text-xs text-slate-500 mt-1">Across all published lessons</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Watched Hours</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">755 hrs</p>
          <p className="text-xs text-slate-500 mt-1">Total recorded class consumption</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Active Cohort Engagement</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">88%</p>
          <p className="text-xs text-slate-500 mt-1">Students active within past 7 days</p>
        </div>
      </div>

      {/* Course Completion Breakdown Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Curriculum Completion & Engagement Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Course Title</th>
                <th className="py-3.5 px-4 font-semibold">Active Viewers</th>
                <th className="py-3.5 px-4 font-semibold">Total Watch Duration</th>
                <th className="py-3.5 px-4 font-semibold">Average Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {engagementMetrics.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-4 font-semibold text-white">{item.course}</td>
                  <td className="py-3.5 px-4 text-slate-300">{item.activeViewers} students</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{item.watchHours}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-cyan-400 h-2 rounded-full"
                          style={{ width: item.completionRate }}
                        />
                      </div>
                      <span className="font-semibold text-white">{item.completionRate}</span>
                    </div>
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
