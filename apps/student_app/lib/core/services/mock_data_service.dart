import 'dart:math';
import '../models/student_models.dart';
import 'remote_sync_service.dart';

class MockDataService {
  static final MockDataService _instance = MockDataService._internal();
  factory MockDataService() => _instance;
  MockDataService._internal() {
    syncWithCloud();
  }

  // Current logged in student
  StudentModel? currentStudent;

  // Active OTP storage: (mobile or email) -> generated 6-digit OTP
  final Map<String, String> _activeOtps = {};

  // Live Class State
  bool isLiveClassActive = true;
  String liveClassTopic = 'Physics Class 12: Electromagnetic Waves & Optics Live Doubt Solving';
  String liveClassSubject = 'Physics';
  String liveClassInstructor = 'Dr. Vikram Seth';
  String liveClassRoomUrl = 'https://meet.jit.si/AetherEd_Physics_LiveClass_Master';
  int liveClassAttendees = 34;

  // Registered authorized students
  final List<StudentModel> registeredStudents = [
    StudentModel(
      id: 's0000000-0000-0000-0000-000000000001',
      name: 'Aarav Patel',
      mobileNumber: '+919876543210',
      email: 'aarav.patel@example.com',
      status: 'active',
      activePlanName: 'All-Science & Math Super Bundle',
      expiryDate: DateTime.now().add(const Duration(days: 170)),
    ),
    StudentModel(
      id: 's0000000-0000-0000-0000-000000000002',
      name: 'Priya Sharma',
      mobileNumber: '+919876543211',
      email: 'priya.sharma@example.com',
      status: 'active',
      activePlanName: 'Physics Master Pass',
      expiryDate: DateTime.now().subtract(const Duration(days: 10)), // Expired!
    ),
    StudentModel(
      id: 's0000000-0000-0000-0000-000000000004',
      name: 'Neha Sundaram',
      mobileNumber: '+919876543213',
      email: 'neha.s@example.com',
      status: 'active',
      activePlanName: 'Physics Master Pass',
      expiryDate: DateTime.now().add(const Duration(days: 90)),
    ),
  ];

  // Courses with curriculum
  List<CourseModel> courses = [
    CourseModel(
      id: 'c0000000-0000-0000-0000-000000000001',
      title: 'Physics Class 12: Electromagnetism & Wave Optics',
      description: 'Master electromagnetic induction, alternating currents, wave nature of light, and interference with conceptual breakdowns and solved problem sets.',
      subject: 'Physics',
      instructor: 'Dr. Vikram Seth',
      thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
      totalLessons: 4,
      completionPercentage: 0.35,
      lessons: [
        LessonModel(
          id: 'l0000000-0000-0000-0000-000000000001',
          courseId: 'c0000000-0000-0000-0000-000000000001',
          title: '01. Introduction to Magnetic Fields & Biot-Savart Law',
          description: 'Fundamental properties of magnetic vectors, current elements, and magnetic field calculations.',
          videoReference: 'videos/physics/ch01_magnetic_fields.mp4',
          durationSeconds: 2400,
          sequence: 1,
          isCompleted: true,
          playbackPositionSeconds: 2300,
        ),
        LessonModel(
          id: 'l0000000-0000-0000-0000-000000000002',
          courseId: 'c0000000-0000-0000-0000-000000000001',
          title: '02. Ampere’s Circuital Law & Solenoid Fields',
          description: 'Line integral of magnetic flux density, symmetry analysis in solenoids, and toroid calculations.',
          videoReference: 'videos/physics/ch02_amperes_law.mp4',
          durationSeconds: 2700,
          sequence: 2,
          isCompleted: false,
          playbackPositionSeconds: 1122, // 18m 42s
        ),
        LessonModel(
          id: 'l0000000-0000-0000-0000-000000000003',
          courseId: 'c0000000-0000-0000-0000-000000000001',
          title: '03. Electromagnetic Induction & Faraday’s Laws',
          description: 'Magnetic flux changes, induced EMF, Lenz law application, and eddy current damping.',
          videoReference: 'videos/physics/ch03_induction.mp4',
          durationSeconds: 3120,
          sequence: 3,
          isCompleted: false,
          playbackPositionSeconds: 0,
        ),
        LessonModel(
          id: 'l0000000-0000-0000-0000-000000000004',
          courseId: 'c0000000-0000-0000-0000-000000000001',
          title: '04. Wave Optics: Huygens Principle & Wavefronts',
          description: 'Secondary wavelets, derivation of reflection and refraction using wavefront propagation.',
          videoReference: 'videos/physics/ch04_wave_optics.mp4',
          durationSeconds: 1980,
          sequence: 4,
          isCompleted: false,
          playbackPositionSeconds: 0,
        ),
      ],
    ),
    CourseModel(
      id: 'c0000000-0000-0000-0000-000000000002',
      title: 'Chemistry Class 12: Chemical Kinetics & Organic Synthesis',
      description: 'In-depth recorded modules covering rate equations, collision theory, reaction mechanisms, and multi-step organic synthesis paths.',
      subject: 'Chemistry',
      instructor: 'Prof. Ananya Roy',
      thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      totalLessons: 2,
      completionPercentage: 0.0,
      lessons: [
        LessonModel(
          id: 'l0000000-0000-0000-0000-000000000010',
          courseId: 'c0000000-0000-0000-0000-000000000002',
          title: '01. Rate of Reaction & Rate Law Determination',
          description: 'Instantaneous versus average reaction rates, differential rate laws, and reaction orders.',
          videoReference: 'videos/chemistry/ch01_reaction_rates.mp4',
          durationSeconds: 2100,
          sequence: 1,
          isCompleted: false,
          playbackPositionSeconds: 0,
        ),
        LessonModel(
          id: 'l0000000-0000-0000-0000-000000000011',
          courseId: 'c0000000-0000-0000-0000-000000000002',
          title: '02. Arrhenius Equation & Activation Energy Analysis',
          description: 'Temperature dependence of rate constants, Arrhenius plots, and catalytic energy profiles.',
          videoReference: 'videos/chemistry/ch02_arrhenius.mp4',
          durationSeconds: 2550,
          sequence: 2,
          isCompleted: false,
          playbackPositionSeconds: 0,
        ),
      ],
    ),
    CourseModel(
      id: 'c0000000-0000-0000-0000-000000000003',
      title: 'Mathematics Class 12: Advanced Calculus & Differential Equations',
      description: 'Calculus masterclass covering limits, definite integrals, differential modeling, and graphical curve analysis.',
      subject: 'Mathematics',
      instructor: 'K. Ramachandran',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      totalLessons: 1,
      completionPercentage: 0.0,
      lessons: [
        LessonModel(
          id: 'l0000000-0000-0000-0000-000000000020',
          courseId: 'c0000000-0000-0000-0000-000000000003',
          title: '01. Limits, Continuity & Derivative Foundations',
          description: 'Epsilon-delta definitions, standard limits, and continuity on closed intervals.',
          videoReference: 'videos/math/ch01_limits.mp4',
          durationSeconds: 2800,
          sequence: 1,
          isCompleted: false,
          playbackPositionSeconds: 0,
        ),
      ],
    ),
  ];

  String _normalizeIdentifier(String identifier) {
    final trimmed = identifier.trim();
    if (trimmed.contains('@')) {
      return trimmed.toLowerCase();
    }
    return trimmed.replaceAll(RegExp(r'\s+'), '');
  }

  /// Find student by mobile number or email address
  StudentModel? findStudent(String identifier) {
    final clean = _normalizeIdentifier(identifier);
    for (final s in registeredStudents) {
      if (clean.contains('@')) {
        if (s.email.toLowerCase() == clean) return s;
      } else {
        if (s.mobileNumber == clean ||
            clean.endsWith(s.mobileNumber.replaceAll('+91', '')) ||
            s.mobileNumber.replaceAll('+91', '') == clean.replaceAll('+91', '')) {
          return s;
        }
      }
    }
    return null;
  }

  /// Request a dynamic 6-digit OTP for any mobile number or email
  String requestOtp(String identifier) {
    final clean = _normalizeIdentifier(identifier);
    // Generate true random 6-digit OTP (100000 - 999999)
    final random = Random();
    final otp = (100000 + random.nextInt(900000)).toString();
    _activeOtps[clean] = otp;
    return otp;
  }

  /// Request Email OTP specifically
  String requestEmailOtp(String email) => requestOtp(email);

  /// Get active OTP for verification notification banner
  String? getActiveOtp(String identifier) {
    final clean = _normalizeIdentifier(identifier);
    return _activeOtps[clean];
  }

  /// Verify entered OTP against dynamic code (or universal demo code)
  bool verifyOtp(String identifier, String enteredOtp) {
    final clean = _normalizeIdentifier(identifier);
    final storedOtp = _activeOtps[clean];
    if (storedOtp != null && storedOtp == enteredOtp) {
      _activeOtps.remove(clean);
      return true;
    }
    // Universal demo fallback
    if (enteredOtp == '123456') {
      return true;
    }
    return false;
  }

  /// Verify Email OTP specifically
  bool verifyEmailOtp(String email, String enteredOtp) => verifyOtp(email, enteredOtp);

  /// Get existing student or auto-register a new user with active courses
  StudentModel getOrCreateStudent(String identifier, {String? name}) {
    final clean = _normalizeIdentifier(identifier);
    var student = findStudent(clean);
    if (student == null) {
      if (clean.contains('@')) {
        final emailPrefix = clean.split('@').first;
        final formattedName = emailPrefix.isNotEmpty
            ? emailPrefix[0].toUpperCase() + emailPrefix.substring(1)
            : 'Student';
        final displayName = (name != null && name.trim().isNotEmpty) ? name.trim() : formattedName;

        student = StudentModel(
          id: 's-${DateTime.now().millisecondsSinceEpoch}',
          name: displayName,
          mobileNumber: '+91 98700 00000',
          email: clean,
          status: 'active',
          activePlanName: 'All-Science & Math Super Bundle',
          expiryDate: DateTime.now().add(const Duration(days: 365)),
        );
      } else {
        final lastDigits = clean.length >= 4
            ? clean.substring(clean.length - 4)
            : clean;
        final displayName = (name != null && name.trim().isNotEmpty)
            ? name.trim()
            : 'Student $lastDigits';

        student = StudentModel(
          id: 's-${DateTime.now().millisecondsSinceEpoch}',
          name: displayName,
          mobileNumber: clean,
          email: '${clean.replaceAll('+', '')}@student.aethered.com',
          status: 'active',
          activePlanName: 'All-Science & Math Super Bundle',
          expiryDate: DateTime.now().add(const Duration(days: 365)),
        );
      }
      registeredStudents.add(student);
    }
    currentStudent = student;
    return student;
  }

  /// Get only purchased/enrolled courses for the given student
  List<CourseModel> getPurchasedCourses(StudentModel student) {
    if (!student.isAccessActive) return [];
    final plan = student.activePlanName?.toLowerCase() ?? '';
    if (plan.contains('bundle') ||
        plan.contains('super') ||
        plan.contains('all-science') ||
        plan.contains('starter') ||
        plan.contains('all')) {
      return courses;
    } else if (plan.contains('physics')) {
      return courses.where((c) => c.subject.toLowerCase() == 'physics').toList();
    } else if (plan.contains('chemistry')) {
      return courses.where((c) => c.subject.toLowerCase() == 'chemistry').toList();
    } else if (plan.contains('math')) {
      return courses.where((c) => c.subject.toLowerCase() == 'mathematics').toList();
    }
    return courses;
  }

  /// Sync courses and lessons dynamically with the live cloud repository
  Future<bool> syncWithCloud() async {
    final remote = await RemoteSyncService().fetchRemoteCourses();
    if (remote != null && remote.isNotEmpty) {
      courses = remote;
      return true;
    }
    return false;
  }

  /// Get the lesson the student should continue
  LessonModel? getContinueLesson() {
    // Default to Physics Lesson 2 (which has 18m 42s recorded)
    for (final course in courses) {
      for (final lesson in course.lessons) {
        if (!lesson.isCompleted && lesson.playbackPositionSeconds > 0) {
          return lesson;
        }
      }
    }
    return courses.first.lessons.first;
  }

  /// Update lesson playback progress
  void updateProgress(String lessonId, int seconds, bool isCompleted) {
    for (int i = 0; i < courses.length; i++) {
      final updatedLessons = courses[i].lessons.map((l) {
        if (l.id == lessonId) {
          return l.copyWith(
            playbackPositionSeconds: seconds,
            isCompleted: isCompleted,
          );
        }
        return l;
      }).toList();

      courses[i] = CourseModel(
        id: courses[i].id,
        title: courses[i].title,
        description: courses[i].description,
        subject: courses[i].subject,
        instructor: courses[i].instructor,
        thumbnailUrl: courses[i].thumbnailUrl,
        totalLessons: courses[i].totalLessons,
        completionPercentage: courses[i].completionPercentage,
        lessons: updatedLessons,
      );
    }
  }
}
