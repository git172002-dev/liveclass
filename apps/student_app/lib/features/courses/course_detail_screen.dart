import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_strings.dart';
import '../../core/models/student_models.dart';
import '../player/video_player_screen.dart';
import '../common/responsive_layout.dart';

class CourseDetailScreen extends StatelessWidget {
  final CourseModel course;

  const CourseDetailScreen({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    final completedCount = course.lessons.where((l) => l.isCompleted).length;
    final progress = course.lessons.isNotEmpty ? completedCount / course.lessons.length : 0.0;

    if (ResponsiveLayout.isLandscapeTablet(context)) {
      return _buildTabletLandscapeView(context, progress, completedCount);
    }

    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      body: CustomScrollView(
        slivers: [
          // Hero Collapsible App Bar with Course Thumbnail
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: AppTheme.darkBg,
            leading: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black.withOpacity(0.5),
                ),
                child: const Icon(Icons.arrow_back_ios_new_rounded, size: 16, color: Colors.white),
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    course.thumbnailUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(color: const Color(0xFF1E293B)),
                  ),
                  // Dark gradient overlay
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          AppTheme.darkBg.withOpacity(0.7),
                          AppTheme.darkBg,
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Course Info & Syllabus
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Subject Tag
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.cyan.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      course.subject.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.cyan,
                        letterSpacing: 0.6,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Course Title
                  Text(
                    course.title,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.4,
                      color: Colors.white,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Instructor & Lesson Count
                  Row(
                    children: [
                      const Icon(Icons.person_outline_rounded, size: 14, color: AppTheme.textSecondary),
                      const SizedBox(width: 6),
                      Text(
                        course.instructor,
                        style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                      ),
                      const SizedBox(width: 12),
                      const Text('•', style: TextStyle(color: Color(0xFF475569))),
                      const SizedBox(width: 12),
                      const Icon(Icons.video_library_outlined, size: 14, color: AppTheme.textSecondary),
                      const SizedBox(width: 6),
                      Text(
                        '${course.lessons.length} Modules',
                        style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Course Description
                  Text(
                    course.description,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF94A3B8),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Progress Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.darkCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.darkCardBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Overall Completion',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                            Text(
                              '${(progress * 100).toInt()}% ($completedCount/${course.lessons.length})',
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.cyan),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progress,
                            backgroundColor: const Color(0xFF1E293B),
                            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.cyan),
                            minHeight: 6,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Syllabus Section Title
                  const Text(
                    AppStrings.syllabus,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.2,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            ),
          ),

          // Lesson List
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final lesson = course.lessons[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _buildLessonTile(context, lesson, index + 1),
                  );
                },
                childCount: course.lessons.length,
              ),
            ),
          ),

          const SliverToBoxAdapter(
            child: SizedBox(height: 40),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonTile(BuildContext context, LessonModel lesson, int displayIndex) {
    return GestureDetector(
      onTap: () {
        if (lesson.isLocked) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('This recorded lecture is locked. Complete previous modules first.'),
            ),
          );
          return;
        }

        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => VideoPlayerScreen(
              lesson: lesson,
              courseTitle: course.title,
            ),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: lesson.isCompleted ? AppTheme.success.withOpacity(0.3) : AppTheme.darkCardBorder,
          ),
        ),
        child: Row(
          children: [
            // Sequence Number / Completion Icon
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: lesson.isCompleted
                    ? AppTheme.success.withOpacity(0.15)
                    : const Color(0xFF0E1524),
                border: Border.all(
                  color: lesson.isCompleted ? AppTheme.success : const Color(0xFF334155),
                ),
              ),
              child: Center(
                child: lesson.isCompleted
                    ? const Icon(Icons.check_rounded, color: AppTheme.success, size: 20)
                    : Text(
                        displayIndex.toString().padLeft(2, '0'),
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.cyan,
                          fontFamily: 'monospace',
                        ),
                      ),
              ),
            ),
            const SizedBox(width: 14),

            // Lesson Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    lesson.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: lesson.isCompleted ? const Color(0xFFE2E8F0) : Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.access_time_rounded, size: 12, color: Color(0xFF64748B)),
                      const SizedBox(width: 4),
                      Text(
                        lesson.durationFormatted,
                        style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                      ),
                      if (lesson.playbackPositionSeconds > 0 && !lesson.isCompleted) ...[
                        const SizedBox(width: 8),
                        Text(
                          '• Resumes at ${_formatSeconds(lesson.playbackPositionSeconds)}',
                          style: const TextStyle(fontSize: 11, color: AppTheme.cyan),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),

            // Trailing Action Icon
            Icon(
              lesson.isLocked ? Icons.lock_outline_rounded : Icons.play_circle_outline_rounded,
              color: lesson.isLocked ? const Color(0xFF64748B) : AppTheme.cyan,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }

  String _formatSeconds(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  Widget _buildTabletLandscapeView(BuildContext context, double progress, int completedCount) {
    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B101D),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 18),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          course.title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 20),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.cyan.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.tablet_mac_rounded, size: 14, color: AppTheme.cyan),
                const SizedBox(width: 6),
                Text(
                  '${course.lessons.length} Modules',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.cyan),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Panel: Course Overview & Progress Card (380px)
            SizedBox(
              width: 380,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: AspectRatio(
                        aspectRatio: 16 / 9,
                        child: Image.network(
                          course.thumbnailUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(color: const Color(0xFF1E293B)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.cyan.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        course.subject.toUpperCase(),
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.cyan),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      course.title,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Instructor: ${course.instructor}',
                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      course.description,
                      style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8), height: 1.4),
                    ),
                    const SizedBox(height: 20),
                    // Progress stats
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.darkCardBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Course Completion', style: TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold)),
                              Text('${(progress * 100).toInt()}%', style: const TextStyle(fontSize: 12, color: AppTheme.cyan, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: progress,
                              minHeight: 6,
                              backgroundColor: const Color(0xFF1E293B),
                              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.cyan),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text('$completedCount of ${course.lessons.length} lessons completed', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const VerticalDivider(width: 1, color: AppTheme.darkCardBorder),
            // Right Panel: Curriculum Modules List
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(24),
                itemCount: course.lessons.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final lesson = course.lessons[index];
                  return _buildLessonTile(context, lesson, index + 1);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
