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
}
