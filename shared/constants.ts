/**
 * Shared System Constants for Futuristic EdTech Platform (V1)
 */

export const APP_CONFIG = {
  APP_NAME: 'AetherEd',
  VERSION: '1.0.0',
  TARGET_AUDIENCE_SIZE: '100-150 students',
  DEFAULT_VIDEO_URL_TTL_SECONDS: 900, // 15 minutes
  PROGRESS_UPDATE_INTERVAL_SECONDS: 10,
  COMPLETION_THRESHOLD_PERCENT: 90, // When watched >= 90%, mark lesson completed
  DEFAULT_PHONE_COUNTRY_CODE: '+91',
} as const;

export const ERROR_MESSAGES = {
  STUDENT_NOT_FOUND: "We couldn't find an account linked to this number. Please contact your administrator.",
  INVALID_OTP: "That code doesn't look right. Please try again.",
  NETWORK_OFFLINE: "Looks like you're offline. Check your connection and try again.",
  ACCESS_EXPIRED: "Your access has expired. Contact your administrator to renew access.",
  UNAUTHORIZED_VIDEO: "You are not authorized to view this video. Please check your active subscription.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
} as const;

export const BREAKPOINTS = {
  PHONE_MAX_WIDTH: 600,
  TABLET_MIN_WIDTH: 601,
  DESKTOP_MIN_WIDTH: 1024,
} as const;
