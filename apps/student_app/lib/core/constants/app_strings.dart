/// Reusable strings and error messages for the Student App.
/// Structured to facilitate localization (English first, Tamil later).
class AppStrings {
  static const String appName = 'AetherEd';
  static const String appTagline = 'Recorded Classes Platform';

  // Auth & Welcome
  static const String welcomeTitle = 'Master Your Classes with Precision';
  static const String welcomeSubtitle = 'High-definition recorded lectures, chapter breakdowns, and seamless progress tracking.';
  static const String enterMobilePrompt = 'Enter Mobile Number';
  static const String enterMobileSubtitle = 'Enter your pre-registered mobile number to receive a secure login OTP.';
  static const String mobileLabel = 'Mobile Number';
  static const String mobileHint = '+91 98765 43210';
  static const String sendOtpButton = 'Send Verification Code';
  static const String verifyOtpTitle = 'Verify Mobile Number';
  static const String verifyOtpSubtitle = 'We sent a 6-digit verification code to';
  static const String verifyOtpButton = 'Verify & Enter Class';
  static const String resendOtp = 'Resend Code';
  static const String resendIn = 'Resend in';

  // Error Messages (from Master Prompt Section 20)
  static const String errStudentNotFound = "We couldn't find an account linked to this number. Please contact your administrator.";
  static const String errInvalidOtp = "That code doesn't look right. Please try again.";
  static const String errOffline = "Looks like you're offline. Check your connection and try again.";
  static const String errAccessExpired = "Your access has expired. Contact your administrator to renew access.";
  static const String errUnauthorizedVideo = "You do not have active authorization to view this recorded class.";

  // Home Dashboard
  static const String greetingMorning = 'Good morning 👋';
  static const String greetingAfternoon = 'Good afternoon 👋';
  static const String greetingEvening = 'Good evening 👋';
  static const String continueLearning = 'Continue Learning';
  static const String myCourses = 'My Courses';
  static const String overallProgress = 'Overall Progress';
  static const String recentlyWatched = 'Recently Watched';
  static const String resumePrompt = 'Continue from';

  // Course Details
  static const String syllabus = 'Course Syllabus';
  static const String totalLessons = 'Lessons';
  static const String completed = 'Completed';
  static const String locked = 'Locked';

  // Profile & Settings
  static const String profileTitle = 'Student Profile';
  static const String subscriptionStatus = 'Subscription & Access';
  static const String activePlan = 'Active Plan';
  static const String validUntil = 'Valid Until';
  static const String darkTheme = 'Dark Theme';
  static const String contactAdmin = 'Contact Administrator';
  static const String signOut = 'Sign Out';
}
