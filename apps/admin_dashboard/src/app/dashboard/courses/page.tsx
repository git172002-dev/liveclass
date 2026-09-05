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
} from "lucide-react";
import { INITIAL_COURSES, Course, Lesson } from "@/lib/mockData";

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubject, setCourseSubject] = useState("Physics");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState("");

  // New Lesson Form State
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonDurationMinutes, setLessonDurationMinutes] = useState(45);
  const [lessonVideoRef, setLessonVideoRef] = useState("videos/physics/lecture_01.mp4");

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const newCourse: Course = {
      id: `c-${Date.now()}`,
      title: courseTitle.trim(),
      subject: courseSubject,
      instructor: courseInstructor.trim() || "Lead Faculty",
      description: courseDescription.trim(),
      thumbnail_url:
        courseThumbnail.trim() ||
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",
      status: "published",
      sequence: courses.length + 1,
      total_lessons: 0,
      lessons: [],
    };

    setCourses([...courses, newCourse]);
    setSelectedCourse(newCourse);
    setIsCourseModalOpen(false);
    setCourseTitle("");
    setCourseDescription("");
    setCourseThumbnail("");
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonVideoRef.trim()) return;

    const currentLessons = selectedCourse.lessons || [];
    const newLesson: Lesson = {
      id: `l-${Date.now()}`,
      course_id: selectedCourse.id,
      title: lessonTitle.trim(),
      description: lessonDescription.trim(),
      video_reference: lessonVideoRef.trim(),
      duration_seconds: lessonDurationMinutes * 60,
      sequence: currentLessons.length + 1,
      status: "published",
    };

    const updatedLessons = [...currentLessons, newLesson];
    const updatedCourse: Course = {
      ...selectedCourse,
      lessons: updatedLessons,
      total_lessons: updatedLessons.length,
    };

    setSelectedCourse(updatedCourse);
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    setIsLessonModalOpen(false);
    setLessonTitle("");
    setLessonDescription("");
  };

  const moveLesson = (index: number, direction: "up" | "down") => {
    const lessons = [...(selectedCourse.lessons || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    // Swap
    const temp = lessons[index];
    lessons[index] = lessons[targetIndex];
    lessons[targetIndex] = temp;

    // Re-index sequence
    const reindexed = lessons.map((l, i) => ({ ...l, sequence: i + 1 }));
    const updatedCourse = { ...selectedCourse, lessons: reindexed };

    setSelectedCourse(updatedCourse);
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Course & Video Management</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize recorded lectures, manage Cloudflare R2 video references, and structure curriculum sequences.
          </p>
        </div>

        <button
          onClick={() => setIsCourseModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Main Grid: Left = Course List, Right = Course Lessons Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Available Courses ({courses.length})
          </h3>

          <div className="space-y-2.5">
            {courses.map((course) => {
              const isSelected = selectedCourse.id === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          {course.subject}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {course.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{course.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {course.lessons?.length || 0} Lessons • {course.instructor}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Inspector & Lessons Editor (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          {/* Selected Course Hero Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedCourse.subject}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Instructor: {selectedCourse.instructor}</span>
              </div>
              <h2 className="text-lg font-bold text-white">{selectedCourse.title}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{selectedCourse.description}</p>
            </div>

            <button
              onClick={() => setIsLessonModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lesson</span>
            </button>
          </div>

          {/* Lessons List with sequence controls */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Curriculum Sequence ({selectedCourse.lessons?.length || 0} Recorded Modules)</span>
              <span className="text-[11px] text-slate-500 lowercase">Use arrows to reorder sequence</span>
            </h3>

            <div className="space-y-2.5">
              {!selectedCourse.lessons || selectedCourse.lessons.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500 text-xs">
                  No lessons added to this course yet. Click "Add Lesson" above to attach recorded classes.
                </div>
              ) : (
                selectedCourse.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-semibold text-white truncate">{lesson.title}</h5>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-cyan-300/80 truncate">
                            <FileVideo className="w-3 h-3 text-cyan-400" />
                            {lesson.video_reference}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(lesson.duration_seconds)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sequence Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveLesson(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveLesson(idx, "down")}
                        disabled={idx === (selectedCourse.lessons?.length || 1) - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Create New Course</h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Class 12: Modern Physics"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Physics"
                    value={courseSubject}
                    onChange={(e) => setCourseSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Instructor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Faculty Name"
                    value={courseInstructor}
                    onChange={(e) => setCourseInstructor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={courseThumbnail}
                  onChange={(e) => setCourseThumbnail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief syllabus description..."
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Add Lesson Module</h3>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Lesson Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 05. Photoelectric Effect & Photons"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cloudflare R2 Video Key / Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="videos/physics/ch05_photoelectric.mp4"
                  value={lessonVideoRef}
                  onChange={(e) => setLessonVideoRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono focus:border-cyan-400"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  The S3/R2 storage key for the MP4 or HLS manifest. Never exposed directly to students.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={lessonDurationMinutes}
                  onChange={(e) => setLessonDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold"
                >
                  Add Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
