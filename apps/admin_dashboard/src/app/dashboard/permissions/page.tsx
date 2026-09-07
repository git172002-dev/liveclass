"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Users,
  Clock,
  Key,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  Smartphone,
  Lock,
  RefreshCw,
  Search,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useSyncedStore, AdminUser } from "@/lib/syncedStore";

export default function PermissionsManagementPage() {
  const { adminUsers, adminLogs, updateAdminPermissions } = useSyncedStore();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser>(adminUsers[0]);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [saveToast, setSaveToast] = useState(false);

  const filteredAdmins = adminUsers.filter((a) => {
    if (filterRole === "all") return true;
    return a.role === filterRole;
  });

  const handlePermissionToggle = (permKey: keyof AdminUser["permissions"]) => {
    const updatedPerms = {
      ...selectedAdmin.permissions,
      [permKey]: !selectedAdmin.permissions[permKey],
    };
    const updated = { ...selectedAdmin, permissions: updatedPerms };
    setSelectedAdmin(updated);
    updateAdminPermissions(selectedAdmin.id, updatedPerms);

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Access Governance & Security
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Audit Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Staff Permissions & Login Audit Console
          </h1>
          <p className="text-sm text-slate-400">
            Track active administrators logged inside the portal and configure role-based operational permissions.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Permissions Synchronized Instantly!</span>
          </div>
        )}
      </div>

      {/* Grid: Left Column (Staff List & Working Permissions), Right Column (Who Is Logged In - Live Audit Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Working Permissions Management */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Staff Role & Working Permissions
                </h3>
                <p className="text-xs text-slate-400">
                  Select a team member to review and toggle authorized dashboard capabilities.
                </p>
              </div>

              {/* Role filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Course Instructor">Course Instructor</option>
                <option value="Content Moderator">Content Moderator</option>
              </select>
            </div>

            {/* Admin selector pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filteredAdmins.map((admin) => {
                const isSelected = selectedAdmin.id === admin.id;
                return (
                  <button
                    key={admin.id}
                    onClick={() => setSelectedAdmin(admin)}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
                      }`}>
                        {admin.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{admin.name}</h4>
                        <span className="text-[10px] text-cyan-400 block truncate">{admin.role}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 truncate">{admin.email}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Admin Profile & Permission Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Configuring Permissions For:
                  </span>
                  <h4 className="text-base font-bold text-white">{selectedAdmin.name}</h4>
                  <p className="text-xs text-cyan-400">{selectedAdmin.role} • {selectedAdmin.mobile_number}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  ID: {selectedAdmin.id}
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Operational Working Permissions
                </h5>

                {/* Perm 1: Manage Courses */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-white">Manage Courses & Syllabi</p>
                    <p className="text-xs text-slate-400">Can create, edit syllabus, and archive course plans</p>
                  </div>
                  <button
                    onClick={() => handlePermissionToggle("manage_courses")}
                    className={`w-12 h-6 rounded-full transition relative cursor-pointer ${
                      selectedAdmin.permissions.manage_courses ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                        selectedAdmin.permissions.manage_courses ? "translate-x-7" : "translate-x-1"
                      } top-1 absolute`}
                    />
                  </button>
                </div>

                {/* Perm 2: Upload & Delete Videos */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-white">Upload & Delete Videos</p>
                    <p className="text-xs text-slate-400">Can upload to GitHub Video storage, configure streaming links, and remove recordings</p>
                  </div>
                  <button
                    onClick={() => handlePermissionToggle("upload_videos")}
                    className={`w-12 h-6 rounded-full transition relative cursor-pointer ${
                      selectedAdmin.permissions.upload_videos ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                        selectedAdmin.permissions.upload_videos ? "translate-x-7" : "translate-x-1"
                      } top-1 absolute`}
                    />
                  </button>
                </div>

                {/* Perm 3: Manage Students */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-white">Student Enrollments & Purchases</p>
                    <p className="text-xs text-slate-400">Can add student phone numbers, authorize OTP access, and assign purchased course bundles</p>
                  </div>
                  <button
                    onClick={() => handlePermissionToggle("manage_students")}
                    className={`w-12 h-6 rounded-full transition relative cursor-pointer ${
                      selectedAdmin.permissions.manage_students ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                        selectedAdmin.permissions.manage_students ? "translate-x-7" : "translate-x-1"
                      } top-1 absolute`}
                    />
                  </button>
                </div>

                {/* Perm 4: View Analytics */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-white">View Platform Analytics & Revenue</p>
                    <p className="text-xs text-slate-400">Can access student watch hours, completion rates, and subscription reports</p>
                  </div>
                  <button
                    onClick={() => handlePermissionToggle("view_analytics")}
                    className={`w-12 h-6 rounded-full transition relative cursor-pointer ${
                      selectedAdmin.permissions.view_analytics ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                        selectedAdmin.permissions.view_analytics ? "translate-x-7" : "translate-x-1"
                      } top-1 absolute`}
                    />
                  </button>
                </div>

                {/* Perm 5: Staff Permissions */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-white">Manage Staff Roles & Permissions</p>
                    <p className="text-xs text-slate-400">Can modify other administrators’ security privileges</p>
                  </div>
                  <button
                    onClick={() => handlePermissionToggle("manage_permissions")}
                    className={`w-12 h-6 rounded-full transition relative cursor-pointer ${
                      selectedAdmin.permissions.manage_permissions ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                        selectedAdmin.permissions.manage_permissions ? "translate-x-7" : "translate-x-1"
                      } top-1 absolute`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: "Who Is Logged In" & Live Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Logged-In Sessions Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Active Portal Logins
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                {adminUsers.length} Authorized
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live tracking of authenticated administrators currently holding valid session tokens.
            </p>

            <div className="space-y-3">
              {adminUsers.map((admin) => (
                <div
                  key={admin.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-slate-950">
                        {admin.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{admin.name}</h4>
                      <p className="text-[10px] text-slate-400">{admin.email}</p>
                      <span className="text-[9px] text-cyan-400 font-semibold">{admin.role}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                      Active Now
                    </span>
                    <p className="text-[9px] text-slate-500 mt-1">2FA Verified</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Audit History Log */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Login & Action Audit Trail
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Immutable chronological record of logins, OTP verifications, and curriculum edits.
            </p>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {adminLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span className="text-cyan-400 font-medium">{log.user_name} ({log.role})</span>
                    <span>{log.ip_address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
