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
} from "lucide-react";
import { useSyncedStore } from "@/lib/syncedStore";
import { Course, Lesson, Student, Subscription } from "@/lib/mockData";

type ScreenState = "splash" | "welcome" | "phone" | "otp" | "home" | "course" | "player" | "profile";

export default function StudentAppPage() {
  const { courses, students, getPurchasedCourses, requestOtp, verifyOtp, registerNewStudent } = useSyncedStore();

  const [screen, setScreen] = useState<ScreenState>("welcome");
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
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

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Re-sync purchased courses whenever store updates
  useEffect(() => {
    if (currentStudent) {
      const data = getPurchasedCourses(currentStudent.mobile_number);
      setStudentCourses(data.courses);
      setActiveSub(data.activeSubscription);
      setIsAccessExpired(data.isExpired);

      // If viewing a course, update its lessons
      if (selectedCourse) {
        const updatedCourse = data.courses.find((c) => c.id === selectedCourse.id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
        }
      }
    }
  }, [courses, currentStudent, getPurchasedCourses, selectedCourse]);

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

  // Handle Phone Validation
  const handleSendOtp = () => {
    setPhoneError("");
    const clean = phoneNumber.replace(/\s+/g, "");
    const digits = clean.replace(/\D/g, "");

    if (digits.length < 10) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Generate real dynamic 6-digit OTP
    const otp = requestOtp(clean);
    setCurrentDynamicOtp(otp);

    // Check if pre-existing student
    const data = getPurchasedCourses(clean);
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

    const clean = phoneNumber.replace(/\s+/g, "");
    const isValid = verifyOtp(clean, code) || code === currentDynamicOtp || code === "123456";

    if (!isValid) {
      setOtpError("Invalid verification code. Please check the SMS banner above and enter the dynamic 6-digit code.");
      return;
    }

    setOtpError("");

    // Auto-create/attach student record
    let student = currentStudent;
    if (!student) {
      student = registerNewStudent(clean);
      setCurrentStudent(student);
    }

    const data = getPurchasedCourses(student.mobile_number);
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
            <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#0B101D] to-[#090D16]">
              <div className="pt-8">
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-white tracking-tight">AetherEd</span>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Recorded Classroom Portal
                  </span>
                  <h1 className="text-2xl font-black text-white leading-tight">
                    Master Class 12 Science & Mathematics.
                  </h1>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero buffer playback, progress memory, and curated lectures. Log in with your registered phone number to access your purchased courses.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pb-4">
                <button
                  onClick={() => setScreen("phone")}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Student Phone Verification</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Pre-Authorized Phone OTP Security
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. PHONE ENTRY SCREEN */}
          {screen === "phone" && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-[#090D16]">
              <div className="space-y-6 pt-4">
                <button
                  onClick={() => setScreen("welcome")}
                  className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-white">Enter Mobile Number</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We will send a 6-digit verification code to your pre-authorized mobile number.
                  </p>
                </div>

                {/* Quick Student Selector for Easy Demo Testing */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Demo Student Accounts:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {students.slice(0, 3).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setPhoneNumber(st.mobile_number)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium transition cursor-pointer ${
                          phoneNumber === st.mobile_number
                            ? "bg-cyan-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {st.name.split(" ")[0]} ({st.assigned_courses_count || 1} courses)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                  {phoneError && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{phoneError}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pb-4">
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <span>Request OTP Code</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 3. OTP VERIFICATION SCREEN */}
          {screen === "otp" && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-[#090D16]">
              <div className="space-y-6 pt-4">
                <button
                  onClick={() => setScreen("phone")}
                  className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Incoming SMS Notification Toast */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Incoming SMS • AetherEd 2FA
                    </span>
                    <span className="text-slate-500 normal-case">Just now</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">
                    Your dynamic verification code is{" "}
                    <strong className="text-cyan-300 font-mono text-sm tracking-widest bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/40">
                      {currentDynamicOtp || "123456"}
                    </strong>
                    . Valid for 5 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const code = currentDynamicOtp || "123456";
                      setOtpValues(code.split(""));
                    }}
                    className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-0.5 cursor-pointer"
                  >
                    <span>Tap to Auto-fill Code</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-white">Enter Verification Code</h2>
                  <p className="text-xs text-slate-400">
                    Sent to <strong className="text-cyan-300">{phoneNumber}</strong>
                  </p>
                </div>

                <div>
                  <div className="flex justify-between gap-1.5">
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        id={`student-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !val && idx > 0) {
                            document.getElementById(`student-otp-${idx - 1}`)?.focus();
                          }
                        }}
                        className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 transition"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-xs text-red-400 mt-2">{otpError}</p>
                  )}

                  <p className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
                    <span>Code sent: <strong className="text-cyan-300 font-mono">{currentDynamicOtp || "123456"}</strong></span>
                    <span
                      className="text-cyan-400 cursor-pointer hover:underline"
                      onClick={() => {
                        const newCode = requestOtp(phoneNumber);
                        setCurrentDynamicOtp(newCode);
                        setOtpValues(["", "", "", "", "", ""]);
                      }}
                    >
                      Resend Code
                    </span>
                  </p>
                </div>
              </div>

              <div className="pb-4 space-y-3">
                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <span>Verify & Unlock Purchased Courses</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 4. HOME SCREEN (PURCHASED COURSES ONLY & REAL-TIME SYNC) */}
          {screen === "home" && (
            <div className="flex-1 flex flex-col p-5 bg-[#090D16] space-y-5 overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Good evening, {currentStudent?.name.split(" ")[0] || "Student"} 👋
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-cyan-400 font-semibold">
                      {activeSub?.plan_name || "Enrolled Student"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-[10px] text-emerald-400 font-medium">
                      ● Cloud Synced
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setScreen("profile")}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  {currentStudent?.name[0] || "S"}
                </button>
              </div>

              {/* Expired Access Alert */}
              {isAccessExpired && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Subscription Expired</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80">
                    Your access plan expired on {new Date(activeSub?.expiry_date || "").toLocaleDateString()}. Please contact your admin to renew.
                  </p>
                </div>
              )}

              {/* Continue Learning Card */}
              {studentCourses.length > 0 && studentCourses[0].lessons && studentCourses[0].lessons.length > 1 && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#131D33] to-[#0E1526] border border-cyan-500/30 shadow-lg shadow-cyan-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Continue Learning
                    </span>
                    <span className="text-[10px] text-slate-400">{studentCourses[0].subject}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {studentCourses[0].lessons[1]?.title || studentCourses[0].lessons[0]?.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {studentCourses[0].instructor} • 45m Lecture
                  </p>

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
                    onClick={() => openLesson(studentCourses[0], studentCourses[0].lessons![1], 1122)}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume Lecture</span>
                  </button>
                </div>
              )}

              {/* MY PURCHASED COURSES SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    My Purchased Courses ({studentCourses.length})
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-medium">
                    {studentCourses.length} Active Plan
                  </span>
                </div>

                {studentCourses.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-white font-semibold">No Purchased Courses Found</p>
                    <p className="text-[11px] text-slate-400">
                      You are not currently enrolled in any active courses. Please contact the administrator.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {studentCourses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setScreen("course");
                        }}
                        className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                            {course.subject}
                          </span>
                          <h5 className="text-xs font-bold text-white truncate">{course.title}</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {course.lessons?.length || 0} Video Modules • {course.instructor}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 5. COURSE DETAIL & SYLLABUS (DYNAMICALLY SYNCED WITH ADMIN DASHBOARD) */}
          {screen === "course" && selectedCourse && (
            <div className="flex-1 flex flex-col bg-[#090D16] overflow-y-auto">
              <div className="p-4 flex items-center gap-2 border-b border-slate-800 sticky top-0 bg-[#090D16] z-10">
                <button
                  onClick={() => setScreen("home")}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs text-white truncate">{selectedCourse.title}</h3>
                  <span className="text-[10px] text-cyan-400 font-medium">
                    {selectedCourse.lessons?.length || 0} Recorded Modules
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-800">
                  <img
                    src={selectedCourse.thumbnail_url}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {selectedCourse.subject} • {selectedCourse.instructor}
                  </span>
                  <h2 className="text-base font-bold text-white mt-1">{selectedCourse.title}</h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Real-time Video Modules List */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                      Syllabus & Video Modules ({selectedCourse.lessons?.length || 0})
                    </h4>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      Live Synced
                    </span>
                  </div>

                  {(!selectedCourse.lessons || selectedCourse.lessons.length === 0) ? (
                    <div className="p-6 text-center rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                      No video lectures added yet. When the admin uploads videos in the dashboard, they will appear here instantly.
                    </div>
                  ) : (
                    selectedCourse.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        onClick={() => openLesson(selectedCourse, lesson, idx === 1 ? 1122 : 0)}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                            {lesson.sequence}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-white truncate">{lesson.title}</h5>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {Math.round(lesson.duration_seconds / 60)} mins
                            </span>
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-cyan-400 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. VIDEO PLAYER SCREEN WITH 18:42 RESUME PROMPT */}
          {screen === "player" && activeLesson && selectedCourse && (
            <div className="flex-1 flex flex-col bg-black relative">
              
              {/* Resume Dialog Prompt (18:42) */}
              {showResumeDialog && (
                <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
                  <div className="w-full max-w-xs glass-panel p-5 rounded-3xl border border-cyan-500/50 shadow-2xl text-center space-y-4 animate-scale-up">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Resume Lecture?</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Continue from <strong className="text-cyan-300">{formatTime(playbackSeconds)}</strong>?
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setPlaybackSeconds(0);
                          setShowResumeDialog(false);
                        }}
                        className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                      >
                        Start Over
                      </button>
                      <button
                        onClick={() => setShowResumeDialog(false)}
                        className="py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Player Header */}
              <div className="p-4 flex items-center justify-between text-white border-b border-slate-900 z-10 bg-slate-950/80">
                <button
                  onClick={() => setScreen("course")}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center min-w-0 flex-1 px-3">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block truncate">
                    {selectedCourse.title}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{activeLesson.title}</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 font-mono">
                  {playbackSpeed}
                </span>
              </div>

              {/* Video Player Canvas */}
              <div className="w-full aspect-video bg-slate-950 relative flex items-center justify-center border-b border-slate-900">
                <video
                  src={activeLesson.video_reference.startsWith("http") ? activeLesson.video_reference : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Lesson Notes & Details */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{activeLesson.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedCourse.instructor} • Module {activeLesson.sequence}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Module Notes</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeLesson.description || "Video module streamed via Cloudflare R2 / GitHub direct storage with encrypted token validation."}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800 truncate">
                    Streaming Reference: {activeLesson.video_reference}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. PROFILE SCREEN */}
          {screen === "profile" && (
            <div className="flex-1 flex flex-col p-5 bg-[#090D16] space-y-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen("home")}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-sm text-white">Student Profile</h3>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-cyan-500/20">
                  {currentStudent?.name[0] || "S"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{currentStudent?.name}</h4>
                  <p className="text-xs text-cyan-400">{currentStudent?.mobile_number}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    ID: {currentStudent?.id}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Subscription & Access Details
                </h5>
                <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Active Plan:</span>
                  <span className="text-white font-semibold">{activeSub?.plan_name || "None"}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Purchased Courses:</span>
                  <span className="text-cyan-300 font-semibold">{studentCourses.length}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400">Expiry Date:</span>
                  <span className="text-white font-mono">
                    {activeSub?.expiry_date ? new Date(activeSub.expiry_date).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-semibold ${isAccessExpired ? "text-red-400" : "text-emerald-400"}`}>
                    {isAccessExpired ? "Expired" : "Active Access"}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setCurrentStudent(null);
                    setScreen("welcome");
                  }}
                  className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
