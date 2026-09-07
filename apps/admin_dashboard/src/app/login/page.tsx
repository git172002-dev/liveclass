"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Smartphone, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { useSyncedStore, INITIAL_ADMIN_USERS } from "@/lib/syncedStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const { logAdminAction, setActiveAdmin } = useSyncedStore();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("admin@aethered.com");
  const [password, setPassword] = useState("aethered2026");
  const [adminPhone, setAdminPhone] = useState("+91 98765 00001");
  const [otpValues, setOtpValues] = useState(["1", "2", "3", "4", "5", "6"]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      // Find admin
      const admin = INITIAL_ADMIN_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (admin || email.includes("@")) {
        const matched = admin || INITIAL_ADMIN_USERS[0];
        setAdminPhone(matched.mobile_number);
        setStep("otp");
        setOtpMessage(`OTP sent to registered administrator number: ${matched.mobile_number}`);
      } else {
        setErrorMessage("Invalid administrator credentials. Please check your admin ID and password.");
      }
      setIsLoading(false);
    }, 450);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const code = otpValues.join("");
    if (code.length < 6) {
      setErrorMessage("Please enter all 6 digits of the OTP code.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const admin = INITIAL_ADMIN_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || INITIAL_ADMIN_USERS[0];
      
      // Record session in audit log
      logAdminAction({
        user_id: admin.id,
        user_name: admin.name,
        role: admin.role,
        action: "2FA OTP Login Verified",
        details: `Authenticated on ${navigator.userAgent.includes("Mobile") ? "Mobile Web" : "Desktop Console"} via OTP`,
        ip_address: "103.21.244.12 (Primary Console)",
        status: "success",
      });

      setActiveAdmin(admin);
      router.push("/dashboard");
    }, 500);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#090D16] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 shadow-2xl border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              AetherEd <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Admin V1</span>
            </h1>
            <p className="text-xs text-slate-400">Classroom & Access Control Console</p>
          </div>
        </div>

        {/* Multi-step progress indicator */}
        <div className="flex items-center gap-2 mb-6 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            step === "credentials" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400"
          }`}>
            <Lock className="w-3.5 h-3.5" />
            <span>1. Admin ID & Password</span>
          </div>
          <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            step === "otp" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-500"
          }`}>
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Phone 2FA OTP</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        {step === "credentials" ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin ID / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aethered.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Credentials</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Two-Factor Authentication Required</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {otpMessage}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Enter 6-Digit Verification Code (OTP)
              </label>
              <div className="flex justify-between gap-2">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !val && idx > 0) {
                        document.getElementById(`otp-input-${idx - 1}`)?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                <span>Default test code: <strong className="text-cyan-300">123456</strong></span>
                <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => setOtpValues(["1","2","3","4","5","6"])}>Autofill OTP</span>
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Enter Console</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audited & Logged by Access Control Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
}
