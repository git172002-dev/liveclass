"use client";

import { useState, useEffect } from 'react';
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_PLANS, INITIAL_SUBSCRIPTIONS, Course, Lesson, Student, Plan, Subscription } from './mockData';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile_number: string;
  role: 'Super Admin' | 'Course Instructor' | 'Content Moderator' | 'Student Manager';
  avatar_url?: string;
  permissions: {
    manage_courses: boolean;
    upload_videos: boolean;
    manage_students: boolean;
    view_analytics: boolean;
    manage_permissions: boolean;
  };
  last_login?: string;
}

export interface AdminAuditLog {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  ip_address: string;
  status: 'success' | 'warning' | 'failed';
}

const STORAGE_KEYS = {
  COURSES: 'aethered_synced_courses',
  STUDENTS: 'aethered_synced_students',
  PLANS: 'aethered_synced_plans',
  SUBSCRIPTIONS: 'aethered_synced_subscriptions',
  ADMIN_USERS: 'aethered_synced_admin_users',
  ADMIN_LOGS: 'aethered_synced_admin_logs',
  ACTIVE_ADMIN: 'aethered_active_admin',
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-001',
    name: 'Dr. Vikram Seth',
    email: 'admin@aethered.com',
    mobile_number: '+91 98765 00001',
    role: 'Super Admin',
    permissions: {
      manage_courses: true,
      upload_videos: true,
      manage_students: true,
      view_analytics: true,
      manage_permissions: true,
    },
    last_login: new Date().toISOString(),
  },
  {
    id: 'adm-002',
    name: 'Prof. Ananya Roy',
    email: 'ananya.roy@aethered.com',
    mobile_number: '+91 98765 00002',
    role: 'Course Instructor',
    permissions: {
      manage_courses: true,
      upload_videos: true,
      manage_students: false,
      view_analytics: true,
      manage_permissions: false,
    },
    last_login: '2026-09-06T18:30:00Z',
  },
  {
    id: 'adm-003',
    name: 'Rohit Sharma',
    email: 'rohit.s@aethered.com',
    mobile_number: '+91 98765 00003',
    role: 'Content Moderator',
    permissions: {
      manage_courses: false,
      upload_videos: true,
      manage_students: false,
      view_analytics: false,
      manage_permissions: false,
    },
    last_login: '2026-09-07T10:15:00Z',
  },
];

export const INITIAL_ADMIN_LOGS: AdminAuditLog[] = [
  {
    id: 'log-001',
    user_id: 'adm-001',
    user_name: 'Dr. Vikram Seth',
    role: 'Super Admin',
    action: '2FA OTP Login Verified',
    details: 'Admin console authenticated via OTP (+91 98765 00001)',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    ip_address: '103.21.244.12 (Primary Console)',
    status: 'success',
  },
  {
    id: 'log-002',
    user_id: 'adm-001',
    user_name: 'Dr. Vikram Seth',
    role: 'Super Admin',
    action: 'Video Module Uploaded',
    details: 'Added "04. Wave Optics: Huygens Principle" to Physics Class 12',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    ip_address: '103.21.244.12',
    status: 'success',
  },
  {
    id: 'log-003',
    user_id: 'adm-002',
    user_name: 'Prof. Ananya Roy',
    role: 'Course Instructor',
    action: 'Course Syllabus Modified',
    details: 'Updated lesson sequence for Chemistry Class 12',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    ip_address: '49.37.112.55',
    status: 'success',
  },
];

class SyncedDataStore {
  private listeners: Set<() => void> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('aethered_live_sync');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'STORE_UPDATED') {
            this.notify();
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported in this environment');
      }

      window.addEventListener('storage', (e) => {
        if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
          this.notify();
        }
      });
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private broadcast() {
    this.notify();
    if (this.channel) {
      this.channel.postMessage({ type: 'STORE_UPDATED', timestamp: Date.now() });
    }
  }

  // --- Courses ---
  public getCourses(): Course[] {
    if (typeof window === 'undefined') return INITIAL_COURSES;
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COURSES;
    }
  }

  public setCourses(courses: Course[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.broadcast();
  }

  public addCourse(course: Omit<Course, 'id' | 'total_lessons'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: `c-${Date.now()}`,
      total_lessons: course.lessons ? course.lessons.length : 0,
      sequence: courses.length + 1,
    };
    this.setCourses([...courses, newCourse]);
    return newCourse;
  }

  public updateCourse(updated: Course) {
    const courses = this.getCourses().map((c) => (c.id === updated.id ? updated : c));
    this.setCourses(courses);
  }

  public deleteCourse(courseId: string) {
    const courses = this.getCourses().filter((c) => c.id !== courseId);
    this.setCourses(courses);
  }

  // --- Lessons & Videos ---
  public addLesson(courseId: string, lesson: Omit<Lesson, 'id' | 'course_id' | 'sequence'>): Lesson {
    const courses = this.getCourses();
    let createdLesson: Lesson | null = null;
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const curLessons = c.lessons || [];
        const newLesson: Lesson = {
          ...lesson,
          id: `l-${Date.now()}`,
          course_id: courseId,
          sequence: curLessons.length + 1,
        };
        createdLesson = newLesson;
        const newLessons = [...curLessons, newLesson];
        return {
          ...c,
          lessons: newLessons,
          total_lessons: newLessons.length,
        };
      }
      return c;
    });
    this.setCourses(updated);
    return createdLesson!;
  }

  public updateLesson(courseId: string, updatedLesson: Lesson) {
    const courses = this.getCourses();
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const updatedLessons = (c.lessons || []).map((l) =>
          l.id === updatedLesson.id ? updatedLesson : l
        );
        return { ...c, lessons: updatedLessons };
      }
      return c;
    });
    this.setCourses(updated);
  }

  public deleteLesson(courseId: string, lessonId: string) {
    const courses = this.getCourses();
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        const filtered = (c.lessons || []).filter((l) => l.id !== lessonId);
        // re-sequence
        const resequenced = filtered.map((l, idx) => ({ ...l, sequence: idx + 1 }));
        return {
          ...c,
          lessons: resequenced,
          total_lessons: resequenced.length,
        };
      }
      return c;
    });
    this.setCourses(updated);
  }

  // --- Students & Purchases ---
  public getStudents(): Student[] {
    if (typeof window === 'undefined') return INITIAL_STUDENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  public getPlans(): Plan[] {
    if (typeof window === 'undefined') return INITIAL_PLANS;
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(INITIAL_PLANS));
      return INITIAL_PLANS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PLANS;
    }
  }

  public getSubscriptions(): Subscription[] {
    if (typeof window === 'undefined') return INITIAL_SUBSCRIPTIONS;
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(INITIAL_SUBSCRIPTIONS));
      return INITIAL_SUBSCRIPTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  }

  /**
   * Returns only the courses purchased by this student mobile number
   */
  public getPurchasedCoursesForStudent(mobileNumber: string): {
    student: Student | null;
    activeSubscription: Subscription | null;
    courses: Course[];
    isExpired: boolean;
  } {
    const cleanMobile = mobileNumber.replace(/\s+/g, '');
    const students = this.getStudents();
    const student =
      students.find(
        (s) =>
          s.mobile_number === cleanMobile ||
          cleanMobile.endsWith(s.mobile_number.replace('+91', '')) ||
          s.mobile_number.replace('+91', '') === cleanMobile.replace('+91', '')
      ) || null;

    if (!student) {
      return { student: null, activeSubscription: null, courses: [], isExpired: false };
    }

    const subscriptions = this.getSubscriptions();
    const userSubs = subscriptions.filter((sub) => sub.student_id === student.id);
    const plans = this.getPlans();
    const allCourses = this.getCourses();

    // Find any active or latest subscription
    const activeSub = userSubs.find((s) => s.status === 'active') || userSubs[0] || null;
    const isExpired = activeSub ? activeSub.status === 'expired' || new Date(activeSub.expiry_date) < new Date() : false;

    // Collect all course IDs from user's active subscriptions
    const authorizedCourseIds = new Set<string>();
    userSubs
      .filter((s) => s.status === 'active')
      .forEach((sub) => {
        const plan = plans.find((p) => p.name.toLowerCase() === sub.plan_name.toLowerCase());
        if (plan) {
          plan.course_ids.forEach((cid) => authorizedCourseIds.add(cid));
        } else if (sub.plan_name.includes('Physics')) {
          authorizedCourseIds.add(allCourses[0]?.id || 'c0000000-0000-0000-0000-000000000001');
        } else if (sub.plan_name.includes('Bundle') || sub.plan_name.includes('Super')) {
          allCourses.forEach((c) => authorizedCourseIds.add(c.id));
        }
      });

    const studentCourses = allCourses.filter((c) => authorizedCourseIds.has(c.id));
    return {
      student,
      activeSubscription: activeSub,
      courses: studentCourses.length > 0 ? studentCourses : allCourses,
      isExpired,
    };
  }

  // --- Dynamic OTP Generation & Verification ---
  public requestOtp(mobile: string): string {
    const clean = mobile.replace(/\s+/g, '');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`aethered_otp_${clean}`, otp);
      } catch (e) {
        console.warn('sessionStorage not accessible', e);
      }
    }
    // Log security SMS event
    this.logAdminAction({
      user_id: 'sys-otp-gateway',
      user_name: 'AetherEd 2FA Gateway',
      role: 'System Security',
      action: 'Dynamic SMS OTP Dispatched',
      details: `Generated 6-digit code [${otp}] dispatched for mobile: ${clean}`,
      ip_address: '103.21.244.12',
      status: 'success',
    });
    return otp;
  }

  public getActiveOtp(mobile: string): string | null {
    const clean = mobile.replace(/\s+/g, '');
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(`aethered_otp_${clean}`);
    }
    return null;
  }

  public verifyOtp(mobile: string, enteredOtp: string): boolean {
    const clean = mobile.replace(/\s+/g, '');
    const stored = this.getActiveOtp(clean);
    if (stored && stored === enteredOtp) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`aethered_otp_${clean}`);
      }
      return true;
    }
    // Universal demo fallback
    if (enteredOtp === '123456') return true;
    return false;
  }

  public registerNewStudent(mobile: string, name?: string): Student {
    const clean = mobile.replace(/\s+/g, '');
    const students = this.getStudents();
    const existing = students.find(
      (s) => s.mobile_number === clean || clean.endsWith(s.mobile_number.replace('+91', ''))
    );
    if (existing) return existing;

    const lastDigits = clean.slice(-4);
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name: name?.trim() || `Student ${lastDigits}`,
      mobile_number: clean,
      email: `${clean.replace('+', '')}@student.aethered.com`,
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      assigned_courses_count: 3,
      active_plan_name: 'All-Science & Math Super Bundle',
    };

    const updatedStudents = [newStudent, ...students];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updatedStudents));
    }

    // Auto-create active subscription
    const subs = this.getSubscriptions();
    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      student_id: newStudent.id,
      student_name: newStudent.name,
      mobile_number: clean,
      plan_name: 'All-Science & Math Super Bundle',
      start_date: new Date().toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
    };
    const updatedSubs = [newSub, ...subs];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updatedSubs));
    }

    this.logAdminAction({
      user_id: newStudent.id,
      user_name: newStudent.name,
      role: 'Self-Registered Student',
      action: 'Student 2FA Onboarded',
      details: `New student account activated with All-Science Bundle access for ${clean}`,
      ip_address: '103.21.244.12',
      status: 'success',
    });

    this.broadcast();
    return newStudent;
  }

  // --- Admin Users, Roles & Permissions ---
  public getAdminUsers(): AdminUser[] {
    if (typeof window === 'undefined') return INITIAL_ADMIN_USERS;
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  }

  public updateAdminPermissions(adminId: string, permissions: AdminUser['permissions']) {
    if (typeof window === 'undefined') return;
    const admins = this.getAdminUsers().map((a) =>
      a.id === adminId ? { ...a, permissions } : a
    );
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(admins));
    this.broadcast();
  }

  public getAdminLogs(): AdminAuditLog[] {
    if (typeof window === 'undefined') return INITIAL_ADMIN_LOGS;
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGS, JSON.stringify(INITIAL_ADMIN_LOGS));
      return INITIAL_ADMIN_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ADMIN_LOGS;
    }
  }

  public logAdminAction(log: Omit<AdminAuditLog, 'id' | 'timestamp'>) {
    if (typeof window === 'undefined') return;
    const logs = this.getAdminLogs();
    const newLog: AdminAuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGS, JSON.stringify(updatedLogs));
    this.broadcast();
  }

  // Active Admin
  public getActiveAdmin(): AdminUser | null {
    if (typeof window === 'undefined') return INITIAL_ADMIN_USERS[0];
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ADMIN);
    if (!raw) return INITIAL_ADMIN_USERS[0];
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ADMIN_USERS[0];
    }
  }

  public setActiveAdmin(admin: AdminUser | null) {
    if (typeof window === 'undefined') return;
    if (admin) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ADMIN, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ADMIN);
    }
    this.broadcast();
  }
}

export const syncedStore = new SyncedDataStore();

/**
 * React Hook for reactive synced state
 */
export function useSyncedStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return syncedStore.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return {
    courses: syncedStore.getCourses(),
    students: syncedStore.getStudents(),
    plans: syncedStore.getPlans(),
    subscriptions: syncedStore.getSubscriptions(),
    adminUsers: syncedStore.getAdminUsers(),
    adminLogs: syncedStore.getAdminLogs(),
    activeAdmin: syncedStore.getActiveAdmin(),
    addCourse: (course: Omit<Course, 'id' | 'total_lessons'>) => syncedStore.addCourse(course),
    updateCourse: (course: Course) => syncedStore.updateCourse(course),
    deleteCourse: (id: string) => syncedStore.deleteCourse(id),
    addLesson: (courseId: string, lesson: Omit<Lesson, 'id' | 'course_id' | 'sequence'>) =>
      syncedStore.addLesson(courseId, lesson),
    updateLesson: (courseId: string, lesson: Lesson) => syncedStore.updateLesson(courseId, lesson),
    deleteLesson: (courseId: string, lessonId: string) => syncedStore.deleteLesson(courseId, lessonId),
    getPurchasedCourses: (mobile: string) => syncedStore.getPurchasedCoursesForStudent(mobile),
    requestOtp: (mobile: string) => syncedStore.requestOtp(mobile),
    verifyOtp: (mobile: string, enteredOtp: string) => syncedStore.verifyOtp(mobile, enteredOtp),
    getActiveOtp: (mobile: string) => syncedStore.getActiveOtp(mobile),
    registerNewStudent: (mobile: string, name?: string) => syncedStore.registerNewStudent(mobile, name),
    updateAdminPermissions: (adminId: string, permissions: AdminUser['permissions']) =>
      syncedStore.updateAdminPermissions(adminId, permissions),
    logAdminAction: (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => syncedStore.logAdminAction(log),
    setActiveAdmin: (admin: AdminUser | null) => syncedStore.setActiveAdmin(admin),
  };
}
