"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Video,
  KeyRound,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  PlayCircle,
} from "lucide-react";
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_SUBSCRIPTIONS } from "@/lib/mockData";

export default function DashboardOverviewPage() {
  const [courses] = useState(INITIAL_COURSES);
  const [students] = useState(INITIAL_STUDENTS);
  const [subscriptions] = useState(INITIAL_SUBSCRIPTIONS);

  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
  const totalSeconds = courses.reduce(
    (acc, c) => acc + (c.lessons?.reduce((lAcc, l) => lAcc + l.duration_seconds, 0) || 0),
    0
  );
  const totalHours = (totalSeconds / 3600).toFixed(1);

  const activeStudents = students.filter((s) => s.status === "active").length;
  const activeSubs = subscriptions.filter((s) => s.status === "active").length;

  const STATS = [
    {
      label: "Total Students",
      value: students.length.toString(),
      subtext: `${activeStudents} active accounts`,
      icon: Users,
      color: "text-cyan-400",
      border: "border-cyan-500/20",
    },
    {
      label: "Active Subscriptions",
      value: activeSubs.toString(),
      subtext: `${subscriptions.length - activeSubs} expired / pending`,
      icon: KeyRound,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      label: "Published Courses",
      value: courses.length.toString(),
      subtext: `${totalLessons} recorded lessons`,
      icon: Video,
      color: "text-purple-400",
      border: "border-purple-500/20",
    },
    {
      label: "Total Video Library",
      value: `${totalHours} hrs`,
      subtext: "Cloudflare R2 storage",
      icon: Clock,
      color: "text-amber-400",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status of student enrollments, course content, and recorded lecture delivery.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/students"
            className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20 transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Students</span>
          </Link>
          <Link
            href="/dashboard/courses"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Video className="w-3.5 h-3.5" />
            <span>+ Add New Course</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`glass-card p-5 rounded-2xl border ${stat.border} relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-xl bg-slate-900/80 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Watched Courses */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Published Courses & Engagement</span>
            </h3>
            <Link
              href="/dashboard/courses"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">{course.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      {course.subject} • {course.instructor} • {course.lessons?.length || 0} Lessons
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Active Students */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Registered Students Status</span>
            </h3>
            <Link
              href="/dashboard/students"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{student.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {student.mobile_number} • Plan: {student.active_plan_name || "None"}
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      student.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
