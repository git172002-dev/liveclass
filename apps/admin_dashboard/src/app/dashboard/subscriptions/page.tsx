"use client";

import { useState } from "react";
import {
  KeyRound,
  Plus,
  Clock,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Layers,
} from "lucide-react";
import {
  INITIAL_PLANS,
  INITIAL_STUDENTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_COURSES,
  Plan,
  Subscription,
} from "@/lib/mockData";

export default function SubscriptionsManagementPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Plan Form State
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planPrice, setPlanPrice] = useState(1999);
  const [planDays, setPlanDays] = useState(90);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Assign Form State
  const [assignStudentId, setAssignStudentId] = useState(INITIAL_STUDENTS[0].id);
  const [assignPlanId, setAssignPlanId] = useState(INITIAL_PLANS[0].id);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim()) return;

    const newPlan: Plan = {
      id: `p-${Date.now()}`,
      name: planName.trim(),
      description: planDesc.trim(),
      price: planPrice,
      duration_days: planDays,
      status: "active",
      course_ids: selectedCourses,
    };

    setPlans([...plans, newPlan]);
    setIsPlanModalOpen(false);
    setPlanName("");
    setPlanDesc("");
    setSelectedCourses([]);
  };

  const handleAssignPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const student = INITIAL_STUDENTS.find((s) => s.id === assignStudentId);
    const plan = plans.find((p) => p.id === assignPlanId);
    if (!student || !plan) return;

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration_days);

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      student_id: student.id,
      student_name: student.name,
      mobile_number: student.mobile_number,
      plan_name: plan.name,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      status: "active",
    };

    setSubscriptions([newSub, ...subscriptions]);
    setIsAssignModalOpen(false);
  };

  const extendSubscription = (subId: string, days: number) => {
    setSubscriptions(
      subscriptions.map((sub) => {
        if (sub.id === subId) {
          const currentExp = new Date(sub.expiry_date);
          const baseDate = currentExp > new Date() ? currentExp : new Date();
          baseDate.setDate(baseDate.getDate() + days);
          return {
            ...sub,
            expiry_date: baseDate.toISOString(),
            status: "active",
          };
        }
        return sub;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Subscriptions & Access Windows</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Define access bundles and govern student course authorization dates. Access is enforced server-side.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Plan</span>
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Grant Access to Student</span>
          </button>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Configured Subscription Plans ({plans.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {plan.duration_days} Days Validity
                </span>
                <span className="text-sm font-bold text-white">₹{plan.price.toLocaleString()}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{plan.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{plan.description}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{plan.course_ids.length} Courses included</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Access & Expiry Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Student Access Records ({subscriptions.length})
          </h3>
          <span className="text-[11px] text-slate-400">Server-side token verification enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Plan Assigned</th>
                <th className="py-3 px-4 font-semibold">Start Date</th>
                <th className="py-3 px-4 font-semibold">Expiry Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Extend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {subscriptions.map((sub) => {
                const isExpired = new Date(sub.expiry_date) < new Date();
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{sub.student_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{sub.mobile_number}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs">
                        {sub.plan_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(sub.start_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          isExpired ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        {new Date(sub.expiry_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          !isExpired
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {!isExpired ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => extendSubscription(sub.id, 30)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-400 border border-slate-700 transition"
                        >
                          +30d
                        </button>
                        <button
                          onClick={() => extendSubscription(sub.id, 90)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-400 border border-slate-700 transition"
                        >
                          +90d
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Create Subscription Plan</h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics & Chemistry Pass"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Days) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={planDays}
                    onChange={(e) => setPlanDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Price (INR) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={planPrice}
                    onChange={(e) => setPlanPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Plan Description</label>
                <textarea
                  rows={2}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Included Courses</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {INITIAL_COURSES.map((c) => {
                    const isChecked = selectedCourses.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCourses([...selectedCourses, c.id]);
                            } else {
                              setSelectedCourses(selectedCourses.filter((id) => id !== c.id));
                            }
                          }}
                          className="rounded text-cyan-400 focus:ring-cyan-400"
                        />
                        <span className="truncate">{c.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Access Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Grant Access to Student</h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignPlan} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Student *</label>
                <select
                  value={assignStudentId}
                  onChange={(e) => setAssignStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                >
                  {INITIAL_STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.mobile_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Plan *</label>
                <select
                  value={assignPlanId}
                  onChange={(e) => setAssignPlanId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.duration_days} days)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold"
                >
                  Authorize Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
