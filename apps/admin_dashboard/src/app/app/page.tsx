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
  Radio,
  AlertCircle,
  Video,
  Mail,
  Mic,
  MicOff,
  VideoOff,
  Hand,
  Share2,
  MessageSquare,
  Search,
  Zap,
  Flame,
  ExternalLink,
} from "lucide-react";
import { useSyncedStore } from "@/lib/syncedStore";
import { Course, Lesson, Student, Subscription } from "@/lib/mockData";

type ScreenState =
  | "splash"
  | "welcome"
  | "phone"
  | "otp"
  | "home"
  | "course"
  | "player"
  | "profile"
  | "live"
  | "library";

export default function StudentAppPage() {
  const { courses, students, getPurchasedCourses, requestOtp, verifyOtp, registerNewStudent } =
    useSyncedStore();

  const [screen, setScreen] = useState<ScreenState>("welcome");
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [emailAddress, setEmailAddress] = useState("client@gmail.com");
  const [phoneError, setPhoneError] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [currentDynamicOtp, setCurrentDynamicOtp] = useState<string>("");

  // Logged-in Student state
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [studentCourses, setStudentCourses] = useState<Course[]>([]);
  const [activeSub, setActiveSub] = useState<Subscription | null>(null);
  const [isAccessExpired, setIsAccessExpired] = useState(false);

  // Active selected lesson/course for detail & playback
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSeconds, setPlaybackSeconds] = useState(1122); // 18m 42s
  const [totalSeconds, setTotalSeconds] = useState(2700); // 45m
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  // Live Class state
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [liveChatMessages, setLiveChatMessages] = useState([
    { sender: "Dr. Vikram Seth", text: "Welcome to today's live interactive masterclass! ⚡", time: "18:30" },
    { sender: "Aarav Patel", text: "Sir, could you explain Lenz's law formula sign convention?", time: "18:32" },
    { sender: "Priya Sharma", text: "The wavefront propagation diagram is so clear! 🔥", time: "18:34" },
  ]);
  const [liveChatInput, setLiveChatInput] = useState("");

  // Library State
  const [librarySubject, setLibrarySubject] = useState("All");
  const [librarySearch, setLibrarySearch] = useState("");

  const liveRoomUrl = "https://meet.jit.si/AetherEd_Physics_LiveClass_Master";

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Re-sync purchased courses whenever store updates
  useEffect(() => {
    if (currentStudent) {
      const target = (isEmailMode ? currentStudent.email : currentStudent.mobile_number) || "";
      const data = getPurchasedCourses(target);
      setStudentCourses(data.courses);
      setActiveSub(data.activeSubscription);
      setIsAccessExpired(data.isExpired);

      if (selectedCourse) {
        const updatedCourse = data.courses.find((c) => c.id === selectedCourse.id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
        }
      }
    }
  }, [courses, currentStudent, getPurchasedCourses, selectedCourse, isEmailMode]);

  // Video playback ticker
  useEffect(() => {
    let interval: any;
    if (screen === "player" && isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => (prev < totalSeconds ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, isPlaying, totalSeconds]);

  // Handle Phone / Email Validation & OTP Request
  const handleSendOtp = () => {
    setPhoneError("");
    const target = isEmailMode ? emailAddress.trim() : phoneNumber.trim();

    if (isEmailMode) {
      if (!target.includes("@") || !target.includes(".")) {
        setPhoneError("Please enter a valid email address (e.g. client@gmail.com).");
        return;
      }
    } else {
      const clean = target.replace(/\s+/g, "");
      const digits = clean.replace(/\D/g, "");
      if (digits.length < 10) {
        setPhoneError("Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    // Generate real dynamic 6-digit OTP
    const otp = requestOtp(target);
    setCurrentDynamicOtp(otp);

    // Check if pre-existing student
    const data = getPurchasedCourses(target);
    if (data.student) {
      setCurrentStudent(data.student);
      setStudentCourses(data.courses);
      setActiveSub(data.activeSubscription);
      setIsAccessExpired(data.isExpired);
    } else {
      setCurrentStudent(null);
    }

    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setScreen("otp");
  };

  // Handle OTP Verification
  const handleVerifyOtp = () => {
    const code = otpValues.join("");
    if (code.length < 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    const target = isEmailMode ? emailAddress.trim() : phoneNumber.trim();
    const isValid = verifyOtp(target, code) || code === currentDynamicOtp || code === "123456";

    if (!isValid) {
      setOtpError("Invalid verification code. Please check the banner above and enter the dynamic 6-digit code.");
      return;
    }

    setOtpError("");

    // Auto-create/attach student record
    let student = currentStudent;
    if (!student) {
      student = registerNewStudent(target);
      setCurrentStudent(student);
    }

    const data = getPurchasedCourses((isEmailMode ? student.email : student.mobile_number) || target);
    setStudentCourses(data.courses);
    setActiveSub(data.activeSubscription);
    setIsAccessExpired(data.isExpired);
    setScreen("home");
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);

    if (val && index < 5) {
      document.getElementById(`student-otp-${index + 1}`)?.focus();
    }
  };

  const openLesson = (course: Course, lesson: Lesson, startSecs: number = 0) => {
    setSelectedCourse(course);
    setActiveLesson(lesson);
    setTotalSeconds(lesson.duration_seconds || 2700);
    setPlaybackSeconds(startSecs);
    if (startSecs > 30) {
      setShowResumeDialog(true);
    }
    setScreen("player");
  };

  // Flatten all lessons for library
  const allLibraryLessons: { course: Course; lesson: Lesson }[] = [];
  courses.forEach((c) => {
    (c.lessons || []).forEach((l) => {
      allLibraryLessons.push({ course: c, lesson: l });
    });
  });

  const filteredLibraryLessons = allLibraryLessons.filter((item) => {
    if (librarySubject !== "All" && item.course.subject.toLowerCase() !== librarySubject.toLowerCase()) {
      return false;
    }
    if (librarySearch.trim()) {
      const q = librarySearch.toLowerCase();
      return (
        item.lesson.title.toLowerCase().includes(q) ||
        item.lesson.description?.toLowerCase().includes(q) ||
        item.course.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#060911] flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-cyan-500 selection:text-black">
      {/* Mobile Shell Frame */}
      <div className="w-full sm:max-w-[420px] h-screen sm:h-[860px] bg-[#090D16] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 shadow-2xl flex flex-col overflow-hidden relative text-slate-100">
        {/* Dynamic Island / Top Speaker */}
        <div className="hidden sm:flex justify-between items-center px-6 pt-3 pb-1 shrink-0 bg-[#090D16] z-50">
          <span className="text-[11px] font-mono text-slate-400">9:41</span>
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
            <div className="w-8 h-1.5 bg-slate-800 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-[9px] text-cyan-400 font-bold uppercase">Sync</span>
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* 1. WELCOME SCREEN */}
          {screen === "welcome" && (
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="pt-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 mb-6">
                  <Play className="w-7 h-7 text-black fill-black ml-1" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NEXT-GEN EDTECH PLATFORM</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Master Science & Math with Precision.
                </h1>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  Stream high-definition recorded classes, join Zoom-like interactive live sessions, and track your syllabus progress seamlessly across devices.
                </p>
              </div>

              <div className="space-y-3 pb-4">
                <button
                  onClick={() => setScreen("phone")}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>Student Sign In with OTP</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <p className="text-[11px] text-slate-500">
                    Real-time verification via Email or Phone OTP
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. PHONE / EMAIL ENTRY SCREEN */}
          {screen === "phone" && (
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <button
                  onClick={() => setScreen("welcome")}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-wider uppercase mb-3">
                  <Zap className="w-3 h-3" />
                  <span>Instant 2FA Passcode</span>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight">Enter Credentials</h2>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Receive a real-time 6-digit dynamic OTP verification code directly to your mobile phone or email inbox.
                </p>

                {/* Segmented Switcher: [ 📱 Mobile Phone ] vs [ ✉️ Email Address ] */}
                <div className="mt-5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 flex gap-1">
                  <button
                    onClick={() => {
                      setIsEmailMode(false);
                      setPhoneError("");
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      !isEmailMode
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Phone</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEmailMode(true);
                      setPhoneError("");
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isEmailMode
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </button>
                </div>

                {/* Input Fields */}
                <div className="mt-5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    {isEmailMode ? "STUDENT EMAIL ADDRESS" : "REGISTERED MOBILE NUMBER"}
                  </label>
                  {!isEmailMode ? (
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-medium focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-medium focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  )}

                  {phoneError && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>

                {/* Quick Test Demo Chips */}
                <div className="mt-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2">
                    {isEmailMode ? "Demo Email Accounts" : "Quick Test Numbers"}
                  </p>
                  {!isEmailMode ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setPhoneNumber("+91 98765 43210")}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:border-cyan-500"
                      >
                        Aarav (+919876543210)
                      </button>
                      <button
                        onClick={() => setPhoneNumber("+91 91234 56789")}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-cyan-400 hover:border-cyan-500"
                      >
                        New User (+919123456789)
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEmailAddress("client@gmail.com")}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-500 text-cyan-300 font-bold"
                      >
                        client@gmail.com
                      </button>
                      <button
                        onClick={() => setEmailAddress("aarav.patel@example.com")}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:border-cyan-500"
                      >
                        aarav.patel@example.com
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pb-4">
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>{isEmailMode ? "Send Real-Time Email OTP" : "Send SMS Verification OTP"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 3. OTP VERIFICATION SCREEN */}
          {screen === "otp" && (
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <button
                  onClick={() => setScreen("phone")}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <h2 className="text-2xl font-bold text-white tracking-tight">Security Code</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Enter the 6-digit passcode dispatched to{" "}
                  <span className="text-white font-semibold">
                    {isEmailMode ? emailAddress : phoneNumber}
                  </span>
                </p>

                {/* Real-time Dynamic OTP Dispatched Notification */}
                <div className="mt-5 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400">
                        {isEmailMode ? "REAL-TIME EMAIL OTP" : "REAL-TIME SMS OTP"}
                      </span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Your Dynamic Passcode:</span>
                      <p className="text-2xl font-black tracking-widest text-white mt-0.5">
                        {currentDynamicOtp || "123456"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const digits = (currentDynamicOtp || "123456").split("");
                        setOtpValues(digits);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition flex items-center gap-1 shadow-md shadow-cyan-500/20"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Auto-Fill</span>
                    </button>
                  </div>
                </div>

                {/* 6 Digit Inputs */}
                <div className="mt-6 flex justify-between gap-2">
                  {otpValues.map((v, i) => (
                    <input
                      key={i}
                      id={`student-otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={v}
                      onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                      className="w-12 h-14 bg-slate-900 border border-slate-700 rounded-xl text-center text-lg font-bold text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-400 text-xs mt-3 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              <div className="pb-4 space-y-3">
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>Verify & Enter AetherEd</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 4. HOME SCREEN (CLASSES) */}
          {screen === "home" && (
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header Profile Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Good evening, {currentStudent?.name.split(" ")[0] || "Student"} 👋
                    </h2>
                    <p className="text-xs text-cyan-400 font-medium">
                      {currentStudent?.active_plan_name || "Enrolled Student"}
                    </p>
                  </div>
                  <button
                    onClick={() => setScreen("profile")}
                    className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-sm shadow-lg shadow-cyan-500/10"
                  >
                    {currentStudent?.name.charAt(0) || "S"}
                  </button>
                </div>

                {/* Gen Z Gamification Bar (Streaks & XP) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-[11px] font-black text-orange-400 tracking-wider">
                      4-DAY STREAK
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-black text-cyan-300 tracking-wider">
                      1,420 XP
                    </span>
                  </div>
                  <button
                    onClick={() => setScreen("library")}
                    className="ml-auto text-[11px] font-bold text-cyan-400 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Video Vault</span>
                  </button>
                </div>

                {/* Pulsing 🔴 LIVE NOW Hero Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-red-500/20 via-slate-900 to-[#0B101D] border border-red-500/50 shadow-xl shadow-red-500/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-red-500 text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LIVE CLASS STREAMING
                    </span>
                    <span className="text-[10px] text-cyan-400 font-semibold">34 Students in Room</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Physics Class 12: Electromagnetic Waves & Optics Live Doubt Solving
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Dr. Vikram Seth • Zoom/Jitsi Video Bridge Active (+50 XP)
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setScreen("live")}
                      className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-red-500/25"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Classroom</span>
                    </button>
                    <button
                      onClick={() => setScreen("library")}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                    >
                      Vault
                    </button>
                  </div>
                </div>

                {/* Enrolled Courses */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    My Enrolled Courses ({studentCourses.length})
                  </h3>
                  <div className="space-y-3">
                    {studentCourses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setScreen("course");
                        }}
                        className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition flex gap-3"
                      >
                        <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 relative">
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {course.subject}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate mt-1">
                            {course.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {course.instructor} • {course.lessons?.length || 0} Lessons
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Bar (4 Destinations) */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-around">
                <button
                  onClick={() => setScreen("home")}
                  className="flex flex-col items-center gap-1 text-cyan-400"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Classes</span>
                </button>
                <button
                  onClick={() => setScreen("library")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Library</span>
                </button>
                <button
                  onClick={() => setScreen("live")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white relative"
                >
                  <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <Video className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Live</span>
                </button>
                <button
                  onClick={() => setScreen("profile")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. LIVE CLASSROOM SCREEN (ZOOM-LIKE) */}
          {screen === "live" && (
            <div className="flex-1 flex flex-col justify-between bg-black">
              <div>
                {/* Top Live Bar */}
                <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
                  <button
                    onClick={() => setScreen("home")}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-red-600 text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LIVE NOW
                    </span>
                    <span className="text-xs font-bold text-white">Physics Class 12</span>
                  </div>
                  <a
                    href={liveRoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 text-xs font-bold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </a>
                </div>

                {/* Simulated Live Video Broadcast Feed */}
                <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-[#0D1526] to-slate-950 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 mx-auto flex items-center justify-center text-cyan-300 font-bold text-xl mb-2 shadow-lg shadow-cyan-500/20">
                      VS
                    </div>
                    <p className="text-sm font-bold text-white">Dr. Vikram Seth</p>
                    <span className="text-[10px] text-cyan-400 font-semibold">
                      Presenting: Electromagnetic Induction & Waves
                    </span>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] text-slate-300">
                    1080p • 60 FPS
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[9px] text-emerald-400">
                    👥 34 In Room
                  </span>
                </div>

                {/* Action Controls */}
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-around">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-2.5 rounded-xl border ${
                      isMicMuted ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-2.5 rounded-xl border ${
                      isVideoOff ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsHandRaised(!isHandRaised)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                      isHandRaised
                        ? "bg-amber-500 text-black border-amber-500"
                        : "bg-slate-800 border-slate-700 text-amber-400"
                    }`}
                  >
                    <Hand className="w-3.5 h-3.5" />
                    <span>{isHandRaised ? "Hand Raised" : "Raise Hand"}</span>
                  </button>
                </div>

                {/* Live Chat Stream */}
                <div className="p-4 space-y-2 max-h-56 overflow-y-auto">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Live Q&A Chat</p>
                  {liveChatMessages.map((m, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span className="font-bold text-cyan-300">{m.sender}</span>
                        <span className="text-[9px]">{m.time}</span>
                      </div>
                      <p className="text-slate-200">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={liveChatInput}
                  onChange={(e) => setLiveChatInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={() => {
                    if (!liveChatInput.trim()) return;
                    setLiveChatMessages((prev) => [
                      ...prev,
                      {
                        sender: currentStudent?.name || "You",
                        text: liveChatInput.trim(),
                        time: "Now",
                      },
                    ]);
                    setLiveChatInput("");
                  }}
                  className="px-3 py-2 bg-cyan-500 text-black font-bold text-xs rounded-xl"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* 6. VIDEO LIBRARY VAULT SCREEN */}
          {screen === "library" && (
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setScreen("home")}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-base font-bold text-white">Video Content Library</h3>
                  <span className="text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    {allLibraryLessons.length} Videos
                  </span>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Search lessons, formulas, topics..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Subject Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {["All", "Physics", "Chemistry", "Mathematics"].map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setLibrarySubject(subj)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
                        librarySubject === subj
                          ? "bg-cyan-500 text-black font-bold"
                          : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>

                {/* Video Lesson Cards */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredLibraryLessons.map(({ course, lesson }) => (
                    <div
                      key={lesson.id}
                      onClick={() => openLesson(course, lesson, lesson.playback_position_seconds || 0)}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition flex gap-3 items-center"
                    >
                      <div className="w-14 h-14 rounded-lg bg-slate-800 shrink-0 relative overflow-hidden">
                        <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-cyan-400 uppercase">
                          {course.subject}
                        </span>
                        <h5 className="text-xs font-bold text-white truncate">{lesson.title}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatTime(lesson.duration_seconds || 2400)} • 1080p Full HD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-around">
                <button
                  onClick={() => setScreen("home")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Classes</span>
                </button>
                <button
                  onClick={() => setScreen("library")}
                  className="flex flex-col items-center gap-1 text-cyan-400"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Library</span>
                </button>
                <button
                  onClick={() => setScreen("live")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <Video className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Live</span>
                </button>
                <button
                  onClick={() => setScreen("profile")}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* 7. COURSE SYLLABUS SCREEN */}
          {screen === "course" && selectedCourse && (
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <button
                  onClick={() => setScreen("home")}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative">
                  <img
                    src={selectedCourse.thumbnail_url}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[9px] font-bold text-cyan-400 uppercase">
                      {selectedCourse.subject}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedCourse.title}</h3>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Course Lessons ({selectedCourse.lessons?.length || 0})
                </h4>
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto">
                  {selectedCourse.lessons?.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      onClick={() => openLesson(selectedCourse, lesson, lesson.playback_position_seconds || 0)}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{lesson.title}</p>
                          <p className="text-[10px] text-slate-400">
                            {formatTime(lesson.duration_seconds || 2400)}
                          </p>
                        </div>
                      </div>
                      <Play className="w-4 h-4 text-cyan-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. VIDEO PLAYER SCREEN */}
          {screen === "player" && activeLesson && (
            <div className="flex-1 flex flex-col justify-between bg-black">
              <div>
                <div className="relative aspect-video bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 to-blue-900/20 flex items-center justify-center">
                    <Play className="w-12 h-12 text-cyan-400 fill-cyan-400 animate-pulse" />
                  </div>
                  <button
                    onClick={() => setScreen("course")}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span>{formatTime(playbackSeconds)}</span>
                    <span>{formatTime(totalSeconds)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">
                    {selectedCourse?.subject}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{activeLesson.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{activeLesson.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800/80 flex items-center justify-center gap-6">
                <button
                  onClick={() => setPlaybackSeconds((prev) => Math.max(0, prev - 10))}
                  className="text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg shadow-cyan-500/25"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                </button>
                <button
                  onClick={() => setPlaybackSeconds((prev) => Math.min(totalSeconds, prev + 10))}
                  className="text-slate-400 hover:text-white"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* 9. PROFILE SCREEN */}
          {screen === "profile" && (
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setScreen("home")}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-base font-bold text-white">Student Profile</h3>
                  <div className="w-8" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold text-xl mx-auto shadow-lg shadow-cyan-500/20 mb-3">
                    {currentStudent?.name.charAt(0) || "S"}
                  </div>
                  <h4 className="text-base font-bold text-white">{currentStudent?.name || "Student"}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentStudent?.email || currentStudent?.mobile_number}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ACTIVE ENROLLED PASS
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Active Plan:</span>
                    <span className="font-semibold text-white">
                      {currentStudent?.active_plan_name || "All-Science Bundle"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Daily Study Streak:</span>
                    <span className="font-bold text-orange-400">🔥 4 Days Active</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Earned XP Points:</span>
                    <span className="font-bold text-cyan-400">⚡ 1,420 XP</span>
                  </div>
                </div>
              </div>

              <div className="pb-4">
                <button
                  onClick={() => {
                    setCurrentStudent(null);
                    setScreen("welcome");
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-red-400 border border-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
