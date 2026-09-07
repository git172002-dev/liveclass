"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Smartphone,
  Sparkles,
  BookOpen,
  Info,
  Calendar,
} from "lucide-react";

type ScreenState = "splash" | "welcome" | "phone" | "otp" | "home" | "course" | "player" | "profile";

export default function StudentAppPage() {
  const [screen, setScreen] = useState<ScreenState>("welcome");
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [phoneError, setPhoneError] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSeconds, setPlaybackSeconds] = useState(1122); // 18m 42s
  const [totalSeconds] = useState(2700); // 45m
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  // Active selected lesson/course
  const [selectedCourse, setSelectedCourse] = useState("Physics Class 12");
  const [selectedLesson, setSelectedLesson] = useState("02. Ampere’s Circuital Law & Solenoid Fields");

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Timer for video playback simulation
  useEffect(() => {
    let interval: any;
    if (screen === "player" && isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => (prev < totalSeconds ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, isPlaying, totalSeconds]);

  // Handle Phone Validation
  const handleSendOtp = () => {
    setPhoneError("");
    const clean = phoneNumber.replace(/\s+/g, "");
    if (clean === "+919876543210" || clean.endsWith("9876543210")) {
      setScreen("otp");
      setOtpValues(["1", "2", "3", "4", "5", "6"]);
    } else {
      setPhoneError("We couldn't find an account linked to this number. Please contact your administrator.");
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = () => {
    const code = otpValues.join("");
    if (code === "000000") {
      setOtpError("That code doesn't look right. Please try again.");
    } else {
      setOtpError("");
      setScreen("home");
    }
  };

  const openLesson = (courseTitle: string, lessonTitle: string, startSecs: number = 0) => {
    setSelectedCourse(courseTitle);
    setSelectedLesson(lessonTitle);
    setPlaybackSeconds(startSecs);
    if (startSecs > 30) {
      setShowResumeDialog(true);
    }
    setScreen("player");
  };

  return (
    <div className="min-h-screen bg-[#060911] flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-cyan-500 selection:text-black">
      {/* Mobile Shell Frame */}
      <div className="w-full sm:max-w-[400px] h-screen sm:h-[844px] bg-[#090D16] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative text-slate-100">
        
        {/* Top Phone Speaker / Island (Visible on desktop view) */}
        <div className="hidden sm:flex justify-center pt-3 pb-1 shrink-0 bg-[#090D16] z-50">
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
            <div className="w-8 h-1.5 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* 1. WELCOME SCREEN */}
          {screen === "welcome" && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#0B101D] to-[#090D16]">
              <div className="pt-8">
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-white tracking-tight">AetherEd</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold tracking-wider text-cyan-400 uppercase mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Recorded Classes V1
                </div>

                <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
                  Master Your Classes with Precision
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  High-definition recorded lectures, chapter breakdowns, and seamless progress tracking across all your devices.
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs text-slate-300">Physics, Chemistry & Mathematics</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs text-slate-300">Auto-resumes playback from last timestamp</span>
                  </div>
                </div>
              </div>

              <div className="pb-6 space-y-3">
                <button
                  onClick={() => setScreen("phone")}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue with Mobile Number</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  Pre-authorized students only • OTP protected
                </p>
              </div>
            </div>
          )}

          {/* 2. PHONE ENTRY SCREEN */}
          {screen === "phone" && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-[#090D16]">
              <div>
                <button
                  onClick={() => setScreen("welcome")}
                  className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Enter Mobile Number</h2>
                <p className="text-xs text-slate-400 mb-6">
                  Enter your pre-registered mobile number to receive a secure login OTP.
                </p>

                {phoneError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p>{phoneError}</p>
                  </div>
                )}

                <div className="space-y-1.5 mb-5">
                  <label className="text-xs font-semibold text-slate-300">Mobile Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setPhoneError("");
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Test Chips */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Quick Test Numbers</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setPhoneNumber("+91 98765 43210");
                        setPhoneError("");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 cursor-pointer"
                    >
                      Aarav (+919876543210)
                    </button>
                    <button
                      onClick={() => {
                        setPhoneNumber("+91 90000 00000");
                        setPhoneError("");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-400 border border-slate-700 cursor-pointer"
                    >
                      Unregistered Number
                    </button>
                  </div>
                </div>
              </div>

              <div className="pb-6">
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Send Verification Code
                </button>
              </div>
            </div>
          )}

          {/* 3. OTP VERIFICATION SCREEN */}
          {screen === "otp" && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-[#090D16]">
              <div>
                <button
                  onClick={() => setScreen("phone")}
                  className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white mb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Verify Mobile Number</h2>
                <p className="text-xs text-slate-400 mb-6">
                  We sent a 6-digit verification code to <span className="text-white font-semibold">{phoneNumber}</span>
                </p>

                {otpError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {otpError}
                  </div>
                )}

                {/* 6 Box OTP Fields */}
                <div className="flex justify-between gap-2 mb-6">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otpValues];
                        newOtp[idx] = e.target.value;
                        setOtpValues(newOtp);
                      }}
                      className="w-12 h-14 rounded-xl bg-slate-900 border border-slate-700 text-center text-xl font-bold text-white focus:outline-none focus:border-cyan-400"
                    />
                  ))}
                </div>

                <div className="text-center space-y-2">
                  <button
                    onClick={() => setOtpValues(["1", "2", "3", "4", "5", "6"])}
                    className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
                  >
                    ⚡ Auto-fill Demo Code (123456)
                  </button>
                  <p className="text-[11px] text-slate-500">Resend in 48s</p>
                </div>
              </div>

              <div className="pb-6">
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Verify & Enter Class
                </button>
              </div>
            </div>
          )}

          {/* 4. HOME DASHBOARD SCREEN */}
          {screen === "home" && (
            <div className="flex-1 p-5 space-y-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white">Good evening, Aarav 👋</h3>
                  <p className="text-xs text-cyan-400 font-medium">All-Science & Math Pass</p>
                </div>
                <button
                  onClick={() => setScreen("profile")}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  A
                </button>
              </div>

              {/* Continue Learning Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#131D33] to-[#0E1526] border border-cyan-500/30 shadow-lg shadow-cyan-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Continue Learning
                  </span>
                  <span className="text-[10px] text-slate-400">Physics 12</span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">
                  02. Ampere’s Circuital Law & Solenoid Fields
                </h4>
                <p className="text-[11px] text-slate-400">Dr. Vikram Seth • 45m Lecture</p>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-cyan-300 font-semibold">Continue from 18:42</span>
                    <span className="text-slate-500">45:00</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-[41%]" />
                  </div>
                </div>

                <button
                  onClick={() => openLesson("Physics Class 12", "02. Ampere’s Circuital Law & Solenoid Fields", 1122)}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Lecture</span>
                </button>
              </div>

              {/* My Courses Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">My Authorized Courses</h4>
                  <span className="text-[11px] text-cyan-400 font-medium">3 Active</span>
                </div>

                {/* Course 1 */}
                <div
                  onClick={() => setScreen("course")}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=300&q=80"
                      alt="Physics"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Physics</span>
                    <h5 className="text-xs font-bold text-white truncate">Electromagnetism & Wave Optics</h5>
                    <p className="text-[10px] text-slate-400">4 Modules • 35% Completed</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>

                {/* Course 2 */}
                <div
                  onClick={() => setScreen("course")}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80"
                      alt="Chemistry"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Chemistry</span>
                    <h5 className="text-xs font-bold text-white truncate">Chemical Kinetics & Synthesis</h5>
                    <p className="text-[10px] text-slate-400">2 Modules • Prof. Ananya</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>

                {/* Course 3 */}
                <div
                  onClick={() => setScreen("course")}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80"
                      alt="Mathematics"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Mathematics</span>
                    <h5 className="text-xs font-bold text-white truncate">Advanced Calculus</h5>
                    <p className="text-[10px] text-slate-400">1 Module • K. Ramachandran</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              </div>
            </div>
          )}

          {/* 5. COURSE DETAIL & SYLLABUS */}
          {screen === "course" && (
            <div className="flex-1 flex flex-col bg-[#090D16] overflow-y-auto">
              <div className="p-4 flex items-center gap-2 border-b border-slate-800">
                <button
                  onClick={() => setScreen("home")}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-sm text-white truncate">Physics Class 12</h3>
              </div>

              <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Physics • Dr. Vikram Seth</span>
                  <h2 className="text-lg font-bold text-white mt-1">Electromagnetism & Wave Optics</h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Master electromagnetic induction, alternating currents, wave nature of light, and interference with conceptual breakdowns.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Course Modules (4)</h4>

                  {/* Module 1 (Completed) */}
                  <div
                    onClick={() => openLesson("Physics Class 12", "01. Introduction to Magnetic Fields", 2400)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">01. Magnetic Fields & Biot-Savart</p>
                        <p className="text-[10px] text-slate-400">40 mins • Completed</p>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-cyan-400" />
                  </div>

                  {/* Module 2 (In Progress - 18:42) */}
                  <div
                    onClick={() => openLesson("Physics Class 12", "02. Ampere’s Circuital Law & Solenoid Fields", 1122)}
                    className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/50 flex items-center justify-between cursor-pointer shadow-md shadow-cyan-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                        2
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">02. Ampere’s Circuital Law</p>
                        <p className="text-[10px] text-cyan-400">Resumes at 18:42 • 45 mins</p>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-cyan-400 fill-current" />
                  </div>

                  {/* Module 3 */}
                  <div
                    onClick={() => openLesson("Physics Class 12", "03. Electromagnetic Induction", 0)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                        3
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-300">03. Electromagnetic Induction</p>
                        <p className="text-[10px] text-slate-500">52 mins • Not started</p>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-slate-500" />
                  </div>

                  {/* Module 4 */}
                  <div
                    onClick={() => openLesson("Physics Class 12", "04. Wave Optics: Huygens Principle", 0)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                        4
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-300">04. Wave Optics: Huygens Principle</p>
                        <p className="text-[10px] text-slate-500">33 mins • Not started</p>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. RECORDED VIDEO PLAYER SCREEN */}
          {screen === "player" && (
            <div className="flex-1 flex flex-col bg-black">
              {/* Player Top Video Area */}
              <div className="h-60 bg-slate-950 relative flex items-center justify-center">
                {/* Simulation Canvas */}
                <div className="text-center space-y-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mx-auto hover:scale-105 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </button>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Cloudflare R2 Presigned Video Stream
                  </p>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setScreen("course")}
                  className="absolute top-3 left-3 p-2 rounded-full bg-black/60 text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Speed selector */}
                <button
                  onClick={() => {
                    const speeds = ["0.75x", "1.0x", "1.25x", "1.5x", "2.0x"];
                    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                    setPlaybackSpeed(next);
                  }}
                  className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-cyan-400 text-xs font-bold font-mono border border-slate-700"
                >
                  {playbackSpeed}
                </button>

                {/* Video Controls Bottom Overlay */}
                <div className="absolute bottom-2 left-3 right-3 space-y-1">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all"
                      style={{ width: `${(playbackSeconds / totalSeconds) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white font-mono">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPlaybackSeconds((s) => Math.max(0, s - 10))}>
                        <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                      <span>{formatTime(playbackSeconds)} / {formatTime(totalSeconds)}</span>
                      <button onClick={() => setPlaybackSeconds((s) => Math.min(totalSeconds, s + 10))}>
                        <RotateCw className="w-3.5 h-3.5 text-slate-300" />
                      </button>
                    </div>
                    <span className="text-cyan-400 text-[9px] font-bold">1080p HD</span>
                  </div>
                </div>

                {/* Resume Prompt Modal Dialog */}
                {showResumeDialog && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#111726] p-4 rounded-2xl border border-cyan-500/40 text-center space-y-3 max-w-xs shadow-2xl">
                      <Clock className="w-8 h-8 text-cyan-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">Resume Lecture?</h4>
                      <p className="text-xs text-slate-400">Continue from 18:42 where you left off?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setPlaybackSeconds(0);
                            setShowResumeDialog(false);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                        >
                          Start Over
                        </button>
                        <button
                          onClick={() => setShowResumeDialog(false)}
                          className="flex-1 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Details */}
              <div className="p-4 space-y-4 bg-[#090D16] flex-1 overflow-y-auto">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{selectedCourse}</span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedLesson}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Solenoid field symmetry, line integral derivation, and boundary condition problem solving for Board & Entrance exams.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setScreen("course");
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 text-cyan-400 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Playback & Mark Complete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. PROFILE & ACCESS STATUS */}
          {screen === "profile" && (
            <div className="flex-1 p-5 space-y-5 overflow-y-auto bg-[#090D16]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScreen("home")}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-base text-white">Student Profile</h3>
              </div>

              {/* Card */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-lg">
                  A
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aarav Patel</h4>
                  <p className="text-xs font-mono text-cyan-400">+91 98765 43210</p>
                  <p className="text-[10px] text-slate-500">aarav.patel@example.com</p>
                </div>
              </div>

              {/* Subscription Status Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Subscription Status</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                    Active Access
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-semibold">All-Science & Math Super Bundle</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Valid Until: 21 Feb 2027 (170 days remaining)</span>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={() => setScreen("welcome")}
                className="w-full py-3 rounded-xl border border-red-500/40 text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-500/10 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Student Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar (Visible on home, course, profile) */}
        {(screen === "home" || screen === "course" || screen === "profile") && (
          <div className="h-14 border-t border-slate-800 bg-[#0B101D] flex items-center justify-around px-6 shrink-0">
            <button
              onClick={() => setScreen("home")}
              className={`flex flex-col items-center gap-1 text-xs font-medium cursor-pointer ${
                screen === "home" || screen === "course" ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px]">Classes</span>
            </button>
            <button
              onClick={() => setScreen("profile")}
              className={`flex flex-col items-center gap-1 text-xs font-medium cursor-pointer ${
                screen === "profile" ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
