"use client";

import { useState } from "react";
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  X,
  Eye,
  UploadCloud,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Radio,
} from "lucide-react";
import { useSyncedStore } from "@/lib/syncedStore";
import { Course, Lesson } from "@/lib/mockData";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function CoursesManagementPage() {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    addLesson,
    updateLesson,
    deleteLesson,
    logAdminAction,
    activeAdmin,
  } = useSyncedStore();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isVideoTesterOpen, setIsVideoTesterOpen] = useState(false);
  const [testVideoUrl, setTestVideoUrl] = useState("");
  const [testVideoTitle, setTestVideoTitle] = useState("");

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubject, setCourseSubject] = useState("Physics");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState("");

  // New Lesson / Video Form State
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonDurationMinutes, setLessonDurationMinutes] = useState(45);
  const [lessonVideoRef, setLessonVideoRef] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
  const [uploadSource, setUploadSource] = useState<"github_release" | "custom_url">("github_release");
  const [githubTag, setGithubTag] = useState("v1.0-videos");
  const [githubFilename, setGithubFilename] = useState("physics_ch01_magnetic_fields.mp4");

  // Toast feedback
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const created = addCourse({
      title: courseTitle.trim(),
      subject: courseSubject,
      instructor: courseInstructor.trim() || "Lead Faculty",
      description: courseDescription.trim(),
      thumbnail_url:
        courseThumbnail.trim() ||
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",
      status: "published",
      sequence: courses.length + 1,
      lessons: [],
    });

    logAdminAction({
      user_id: activeAdmin?.id || "adm-001",
      user_name: activeAdmin?.name || "Admin",
      role: activeAdmin?.role || "Super Admin",
      action: "New Course Plan Created",
      details: `Created "${created.title}" with real-time sync to student mobile apps`,
      ip_address: "103.21.244.12",
      status: "success",
    });

    setSelectedCourseId(created.id);
    setIsCourseModalOpen(false);
    setCourseTitle("");
    setCourseDescription("");
    setCourseThumbnail("");
    triggerToast(`Course "${created.title}" published & synced to mobile apps!`);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    const finalVideoUrl =
      uploadSource === "github_release"
        ? `https://github.com/git172002-dev/liveclass/releases/download/${githubTag}/${githubFilename}`
        : lessonVideoRef.trim();

    if (!selectedCourse) return;

    const newLesson = addLesson(selectedCourse.id, {
      title: lessonTitle.trim(),
      description: lessonDescription.trim(),
      video_reference: finalVideoUrl,
      duration_seconds: lessonDurationMinutes * 60,
      status: "published",
    });

    logAdminAction({
      user_id: activeAdmin?.id || "adm-001",
      user_name: activeAdmin?.name || "Admin",
      role: activeAdmin?.role || "Super Admin",
      action: "Video Lesson Uploaded",
      details: `Added "${newLesson.title}" to ${selectedCourse.title} via GitHub Video Portal`,
      ip_address: "103.21.244.12",
      status: "success",
    });

    setIsLessonModalOpen(false);
    setLessonTitle("");
    setLessonDescription("");
    triggerToast(`Video "${newLesson.title}" uploaded & synced to student apps!`);
  };

  const handleDeleteLesson = (lessonId: string, title: string) => {
    if (!selectedCourse) return;
    if (confirm(`Are you sure you want to remove "${title}"? This video will immediately be removed from all student mobile apps.`)) {
      deleteLesson(selectedCourse.id, lessonId);

      logAdminAction({
        user_id: activeAdmin?.id || "adm-001",
        user_name: activeAdmin?.name || "Admin",
        role: activeAdmin?.role || "Super Admin",
        action: "Video Lesson Removed",
        details: `Deleted "${title}" from ${selectedCourse.title}`,
        ip_address: "103.21.244.12",
        status: "warning",
      });

      triggerToast(`Video "${title}" removed & removed from mobile apps!`);
    }
  };

  const handleDeleteCourse = (courseId: string, title: string) => {
    if (confirm(`Delete course "${title}" and all its video modules?`)) {
      deleteCourse(courseId);
      if (courses.length > 1) {
        const remaining = courses.filter((c) => c.id !== courseId);
        setSelectedCourseId(remaining[0]?.id || "");
      }
      triggerToast(`Course "${title}" removed.`);
    }
  };

  const openVideoTester = (url: string, title: string) => {
    setTestVideoUrl(url);
    setTestVideoTitle(title);
    setIsVideoTesterOpen(true);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-bold shadow-2xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Top Banner: GitHub Video Portal Integration */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0E1726] to-[#090D16] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub Video Storage & Streaming Portal
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Live Sync to Mobile App
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Course Plans & Video Sequencer
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Upload and manage your video library (hosting up to 100 high-definition master videos on GitHub Releases / CDN).
              Any change, new video upload, or video deletion immediately updates enrolled students&apos; mobile devices in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Create Course Plan</span>
            </button>
            <button
              onClick={() => setIsLessonModalOpen(true)}
              disabled={!selectedCourse}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Video Module</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Course Selector, Right Course Lessons & Video Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Course Plans List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Course Plans ({courses.length})
            </h3>
            <span className="text-[11px] text-cyan-400 font-semibold">Active Curriculum</span>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const isSelected = selectedCourse?.id === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          {course.subject}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                          {course.total_lessons} Videos
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">{course.instructor}</p>
                    </div>
                  </div>

                  {courses.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id, course.title);
                      }}
                      title="Delete Course"
                      className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Course Detail & Video Portal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCourse ? (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
              
              {/* Course Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      {selectedCourse.subject}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">Instructor: {selectedCourse.instructor}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedCourse.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {selectedCourse.description}
                  </p>
                </div>

                <button
                  onClick={() => setIsLessonModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video to Syllabus</span>
                </button>
              </div>

              {/* Video Lessons Sequencer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-cyan-400" />
                    Video Portal Modules ({selectedCourse.lessons?.length || 0})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Auto-synchronized to Student App
                  </span>
                </div>

                {(!selectedCourse.lessons || selectedCourse.lessons.length === 0) ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 space-y-3">
                    <FileVideo className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm text-slate-400">No video modules added to this course plan yet.</p>
                    <button
                      onClick={() => setIsLessonModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
                    >
                      Upload First Video Module
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedCourse.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                            {lesson.sequence}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white truncate">{lesson.title}</h4>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {lesson.description || "Interactive video module"}
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-cyan-400" />
                                {Math.round(lesson.duration_seconds / 60)} mins
                              </span>
                              <span className="font-mono truncate max-w-xs text-slate-400">
                                {lesson.video_reference}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Test / Preview Video Button */}
                          <button
                            onClick={() => openVideoTester(lesson.video_reference, lesson.title)}
                            title="Preview Video Playback"
                            className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>

                          {/* Delete Video Button */}
                          <button
                            onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                            title="Remove Video"
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select or create a course to manage videos.
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: CREATE COURSE PLAN */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Create New Course Plan</h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Mathematics Class 12: Calculus"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={courseSubject}
                    onChange={(e) => setCourseSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={courseInstructor}
                    onChange={(e) => setCourseInstructor(e.target.value)}
                    placeholder="e.g. Dr. Vikram Seth"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Comprehensive summary of course modules..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={courseThumbnail}
                  onChange={(e) => setCourseThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
                >
                  Save Course Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD VIDEO MODULE VIA GITHUB VIDEO PORTAL */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-cyan-400" />
                  Upload Video to Course Plan
                </h3>
                <p className="text-xs text-slate-400">
                  Target Course: <strong className="text-cyan-300">{selectedCourse?.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Lesson / Video Title
                </label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. 05. Faraday's Law & Induced EMF"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={lessonDurationMinutes}
                    onChange={(e) => setLessonDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Video Storage Method
                  </label>
                  <select
                    value={uploadSource}
                    onChange={(e) => setUploadSource(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="github_release">GitHub Video Storage</option>
                    <option value="custom_url">Direct Video Streaming URL</option>
                  </select>
                </div>
              </div>

              {uploadSource === "github_release" ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub Release Media Ingestion (Supports up to 2 GB per video)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Release Tag</label>
                      <input
                        type="text"
                        value={githubTag}
                        onChange={(e) => setGithubTag(e.target.value)}
                        placeholder="v1.0-videos"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Video File Name</label>
                      <input
                        type="text"
                        value={githubFilename}
                        onChange={(e) => setGithubFilename(e.target.value)}
                        placeholder="lecture_01.mp4"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 break-all">
                    Generated Streaming CDN URL:{" "}
                    <span className="text-cyan-300 font-mono">
                      https://github.com/git172002-dev/liveclass/releases/download/{githubTag}/{githubFilename}
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Direct Video Stream URL (.mp4 / .m3u8)
                  </label>
                  <input
                    type="url"
                    required
                    value={lessonVideoRef}
                    onChange={(e) => setLessonVideoRef(e.target.value)}
                    placeholder="https://.../video.mp4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Lesson Notes & Summary
                </label>
                <textarea
                  rows={2}
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  placeholder="Key concepts covered in this recorded module..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25"
                >
                  Publish & Broadcast to Mobile App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DIRECT VIDEO PLAYBACK TESTER */}
      {isVideoTesterOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl glass-panel p-6 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Video Portal Streaming Player
                </span>
                <h3 className="font-bold text-white text-base truncate">{testVideoTitle}</h3>
              </div>
              <button
                onClick={() => setIsVideoTesterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Native Video Player with controls */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner flex items-center justify-center">
              <video
                src={testVideoUrl.startsWith("http") ? testVideoUrl : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate max-w-md font-mono">
                Source: {testVideoUrl}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px]">
                Stream Verified
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
