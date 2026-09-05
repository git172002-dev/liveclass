/**
 * Shared Type Definitions for Futuristic EdTech Platform (V1)
 * Used across Admin Dashboard (Next.js), Supabase Edge Functions, and testing scripts.
 */

export type StudentStatus = 'active' | 'inactive' | 'blocked';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type SubscriptionStatus = 'active' | 'expired' | 'revoked';
export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface Student {
  id: string;
  auth_user_id?: string | null;
  name: string;
  mobile_number: string;
  email?: string | null;
  profile_image?: string | null;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  instructor: string;
  thumbnail_url?: string | null;
  status: ContentStatus;
  sequence: number;
  created_at: string;
  updated_at: string;
  // Computed fields
  total_lessons?: number;
  completion_percentage?: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  video_reference: string;
  thumbnail_url?: string | null;
  duration_seconds: number;
  sequence: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  // Progress/access fields
  is_locked?: boolean;
  is_completed?: boolean;
  playback_position_seconds?: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  status: 'active' | 'inactive';
  created_at: string;
  course_ids?: string[];
}

export interface Subscription {
  id: string;
  student_id: string;
  plan_id: string;
  start_date: string;
  expiry_date: string;
  status: SubscriptionStatus;
  created_at: string;
  plan?: Plan;
}

export interface StudentCourseAccess {
  id: string;
  student_id: string;
  course_id: string;
  subscription_id?: string | null;
  access_start: string;
  access_end: string;
  status: SubscriptionStatus;
}

export interface WatchProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  playback_position_seconds: number;
  completion_percentage: number;
  completed: boolean;
  last_watched_at: string;
}

export interface AdminUser {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'active' | 'inactive';
}

export interface CheckStudentResponse {
  is_registered: boolean;
  student_id?: string;
  name?: string;
  message?: string;
}

export interface VideoPlaybackResponse {
  playback_url: string;
  resume_position_seconds: number;
  expires_at: number;
  title: string;
  duration_seconds: number;
}
