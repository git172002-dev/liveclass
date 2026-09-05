"use client";

import { useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { INITIAL_STUDENTS, Student } from "@/lib/mockData";

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formMobile, setFormMobile] = useState("+91");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "inactive" | "blocked">("active");

  const openCreateModal = () => {
    setModalMode("create");
    setActiveStudent(null);
    setFormName("");
    setFormMobile("+91");
    setFormEmail("");
    setFormStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setModalMode("edit");
    setActiveStudent(student);
    setFormName(student.name);
    setFormMobile(student.mobile_number);
    setFormEmail(student.email || "");
    setFormStatus(student.status);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMobile.trim()) return;

    if (modalMode === "create") {
      const newStudent: Student = {
        id: `s-${Date.now()}`,
        name: formName.trim(),
        mobile_number: formMobile.trim(),
        email: formEmail.trim() || undefined,
        status: formStatus,
        created_at: new Date().toISOString(),
        assigned_courses_count: 0,
        active_plan_name: "None",
      };
      setStudents([newStudent, ...students]);
    } else if (modalMode === "edit" && activeStudent) {
      setStudents(
        students.map((s) =>
          s.id === activeStudent.id
            ? {
                ...s,
                name: formName.trim(),
                mobile_number: formMobile.trim(),
                email: formEmail.trim() || undefined,
                status: formStatus,
              }
            : s
        )
      );
    }
    setIsModalOpen(false);
  };

  const toggleStudentStatus = (studentId: string) => {
    setStudents(
      students.map((s) => {
        if (s.id === studentId) {
          const nextStatus = s.status === "active" ? "inactive" : "active";
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobile_number.includes(searchQuery) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Student Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {students.length} Total
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Authorize student phone numbers for OTP login and assign curriculum access.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Pre-Authorized Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, mobile number (+91...), or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        <div className="flex gap-2">
          {["all", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium capitalize transition cursor-pointer ${
                statusFilter === status
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Student Name</th>
                <th className="py-3.5 px-4 font-semibold">Mobile (Login Identifier)</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Plan / Access</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Registered</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-xs shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.email || "No email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {student.mobile_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {student.active_plan_name || "None"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          student.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : student.status === "inactive"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(student)}
                          title="Edit Student"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleStudentStatus(student.id)}
                          title={student.status === "active" ? "Deactivate" : "Activate"}
                          className={`p-1.5 rounded-lg transition ${
                            student.status === "active"
                              ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          {student.status === "active" ? (
                            <XCircle className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">
                {modalMode === "create" ? "Add Pre-Authorized Student" : "Edit Student Profile"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Patel"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Mobile Number (E.164 with Country Code) <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+919876543210"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Only this number will be permitted to request OTP on the student mobile app.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Account Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="active">Active (Permitted to log in)</option>
                  <option value="inactive">Inactive (Suspended)</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
                >
                  {modalMode === "create" ? "Save & Authorize" : "Update Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
