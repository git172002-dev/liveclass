class StudentModel {
  final String id;
  final String name;
  final String mobileNumber;
  final String? email;
  final String? profileImage;
  final String status;
  final String? activePlanName;
  final DateTime? expiryDate;

  StudentModel({
    required this.id,
    required this.name,
    required this.mobileNumber,
    this.email,
    this.profileImage,
    required this.status,
    this.activePlanName,
    this.expiryDate,
  });

  bool get isAccessActive {
    if (status != 'active') return false;
    if (expiryDate == null) return true;
    return expiryDate!.isAfter(DateTime.now());
  }

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    return StudentModel(
      id: json['id'] as String,
      name: json['name'] as String,
      mobileNumber: json['mobile_number'] as String,
      email: json['email'] as String?,
      profileImage: json['profile_image'] as String?,
      status: json['status'] as String? ?? 'active',
      activePlanName: json['active_plan_name'] as String?,
      expiryDate: json['expiry_date'] != null
          ? DateTime.parse(json['expiry_date'] as String)
          : null,
    );
  }
}

class LessonModel {
  final String id;
  final String courseId;
  final String title;
  final String description;
  final String videoReference;
  final String? thumbnailUrl;
  final int durationSeconds;
  final int sequence;
  final bool isCompleted;
  final bool isLocked;
  final int playbackPositionSeconds;

  LessonModel({
    required this.id,
    required this.courseId,
    required this.title,
    required this.description,
    required this.videoReference,
    this.thumbnailUrl,
    required this.durationSeconds,
    required this.sequence,
    this.isCompleted = false,
    this.isLocked = false,
    this.playbackPositionSeconds = 0,
  });

  String get durationFormatted {
    final mins = durationSeconds ~/ 60;
    return '${mins}m';
  }

  LessonModel copyWith({
    bool? isCompleted,
    int? playbackPositionSeconds,
  }) {
    return LessonModel(
      id: id,
      courseId: courseId,
      title: title,
      description: description,
      videoReference: videoReference,
      thumbnailUrl: thumbnailUrl,
      durationSeconds: durationSeconds,
      sequence: sequence,
      isCompleted: isCompleted ?? this.isCompleted,
      isLocked: isLocked,
      playbackPositionSeconds:
          playbackPositionSeconds ?? this.playbackPositionSeconds,
    );
  }
}

class CourseModel {
  final String id;
  final String title;
  final String description;
  final String subject;
  final String instructor;
  final String thumbnailUrl;
  final int totalLessons;
  final double completionPercentage;
  final List<LessonModel> lessons;
  final LessonModel? continueLesson;

  CourseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.subject,
    required this.instructor,
    required this.thumbnailUrl,
    required this.totalLessons,
    this.completionPercentage = 0.0,
    required this.lessons,
    this.continueLesson,
  });

  factory CourseModel.fromJson(Map<String, dynamic> json) {
    final rawLessons = json['lessons'] as List<dynamic>? ?? [];
    final lessonsList = rawLessons.map((l) {
      final map = l as Map<String, dynamic>;
      return LessonModel(
        id: map['id'] as String? ?? 'l-${DateTime.now().millisecondsSinceEpoch}',
        courseId: map['course_id'] as String? ?? json['id'] as String? ?? '',
        title: map['title'] as String? ?? 'Untitled Lesson',
        description: map['description'] as String? ?? '',
        videoReference: map['video_reference'] as String? ?? '',
        durationSeconds: (map['duration_seconds'] as num?)?.toInt() ?? 2400,
        sequence: (map['sequence'] as num?)?.toInt() ?? 1,
        isCompleted: map['is_completed'] as bool? ?? false,
        playbackPositionSeconds: (map['playback_position_seconds'] as num?)?.toInt() ?? 0,
      );
    }).toList();

    return CourseModel(
      id: json['id'] as String? ?? 'c-${DateTime.now().millisecondsSinceEpoch}',
      title: json['title'] as String? ?? 'Untitled Course',
      description: json['description'] as String? ?? '',
      subject: json['subject'] as String? ?? 'General',
      instructor: json['instructor'] as String? ?? 'Lead Faculty',
      thumbnailUrl: json['thumbnail_url'] as String? ??
          'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
      totalLessons: lessonsList.isNotEmpty ? lessonsList.length : ((json['total_lessons'] as num?)?.toInt() ?? 0),
      completionPercentage: (json['completion_percentage'] as num?)?.toDouble() ?? 0.0,
      lessons: lessonsList,
    );
  }
}
