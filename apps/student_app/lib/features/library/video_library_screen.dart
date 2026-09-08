import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/models/student_models.dart';
import '../../core/services/mock_data_service.dart';
import '../player/video_player_screen.dart';

class VideoLibraryScreen extends StatefulWidget {
  final VoidCallback? onBack;

  const VideoLibraryScreen({super.key, this.onBack});

  @override
  State<VideoLibraryScreen> createState() => _VideoLibraryScreenState();
}

class _VideoLibraryScreenState extends State<VideoLibraryScreen> {
  final MockDataService _dataService = MockDataService();
  final TextEditingController _searchController = TextEditingController();
  String _selectedSubject = 'All';
  String _searchQuery = '';

  final List<String> _subjects = ['All', 'Physics', 'Chemistry', 'Mathematics'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  String _formatDuration(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '$m:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    // Gather all lessons across all courses
    final List<Map<String, dynamic>> allVideoItems = [];
    for (final course in _dataService.courses) {
      for (final lesson in course.lessons) {
        allVideoItems.add({
          'course': course,
          'lesson': lesson,
        });
      }
    }

    // Filter by subject and search query
    final filteredVideos = allVideoItems.where((item) {
      final CourseModel course = item['course'];
      final LessonModel lesson = item['lesson'];

      // Subject Filter
      if (_selectedSubject != 'All' && course.subject.toLowerCase() != _selectedSubject.toLowerCase()) {
        return false;
      }

      // Search Query Filter
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final matchesTitle = lesson.title.toLowerCase().contains(q);
        final matchesDesc = lesson.description.toLowerCase().contains(q);
        final matchesCourse = course.title.toLowerCase().contains(q);
        final matchesInstructor = course.instructor.toLowerCase().contains(q);
        return matchesTitle || matchesDesc || matchesCourse || matchesInstructor;
      }

      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B101D),
        elevation: 0,
        leading: widget.onBack != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                onPressed: widget.onBack,
              )
            : null,
        title: const Text(
          'Video Content Library',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.cyan.withOpacity(0.12),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.cyan.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.cloud_done_rounded, size: 12, color: AppTheme.cyan),
                const SizedBox(width: 4),
                Text(
                  '${allVideoItems.length} Videos',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.cyan,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search & Filter Header Container
            Container(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 14),
              decoration: const BoxDecoration(
                color: Color(0xFF0B101D),
                border: Border(bottom: BorderSide(color: AppTheme.darkCardBorder)),
              ),
              child: Column(
                children: [
                  // Search Bar
                  TextField(
                    controller: _searchController,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Search recorded classes, topics, or formulas...',
                      hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                      prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.cyan, size: 20),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18, color: Color(0xFF94A3B8)),
                              onPressed: () {
                                setState(() {
                                  _searchController.clear();
                                  _searchQuery = '';
                                });
                              },
                            )
                          : null,
                      filled: true,
                      fillColor: const Color(0xFF080C14),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFF1E293B)),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: Color(0xFF1E293B)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppTheme.cyan),
                      ),
                    ),
                    onChanged: (value) {
                      setState(() {
                        _searchQuery = value.trim();
                      });
                    },
                  ),

                  const SizedBox(height: 12),

                  // Subject Filter Chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _subjects.map((subj) {
                        final isSelected = _selectedSubject == subj;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(
                              subj == 'All'
                                  ? 'All Subjects'
                                  : subj == 'Physics'
                                      ? '⚛️ Physics'
                                      : subj == 'Chemistry'
                                          ? '🧪 Chemistry'
                                          : '📐 Mathematics',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                color: isSelected ? Colors.black : const Color(0xFFCBD5E1),
                              ),
                            ),
                            selected: isSelected,
                            selectedColor: AppTheme.cyan,
                            backgroundColor: const Color(0xFF080C14),
                            side: BorderSide(
                              color: isSelected ? AppTheme.cyan : const Color(0xFF1E293B),
                            ),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            onSelected: (selected) {
                              if (selected) {
                                setState(() {
                                  _selectedSubject = subj;
                                });
                              }
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),

            // Video Cards List
            Expanded(
              child: filteredVideos.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.video_library_outlined, size: 48, color: Colors.white.withOpacity(0.2)),
                          const SizedBox(height: 12),
                          const Text(
                            'No recorded videos found',
                            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Try adjusting your search or subject filter',
                            style: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 12),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: filteredVideos.length,
                      itemBuilder: (context, index) {
                        final item = filteredVideos[index];
                        final CourseModel course = item['course'];
                        final LessonModel lesson = item['lesson'];

                        final isCompleted = lesson.isCompleted;
                        final isInProgress = !isCompleted && lesson.playbackPositionSeconds > 0;

                        return Container(
                          margin: const EdgeInsets.only(bottom: 14),
                          decoration: BoxDecoration(
                            color: AppTheme.darkCard,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isInProgress
                                  ? AppTheme.cyan.withOpacity(0.4)
                                  : AppTheme.darkCardBorder,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(14),
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => VideoPlayerScreen(
                                    lesson: lesson,
                                    courseTitle: course.title,
                                  ),
                                ),
                              ).then((_) {
                                setState(() {}); // Refresh progress on return
                              });
                            },
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Video Thumbnail with Duration badge
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Stack(
                                      children: [
                                        Image.network(
                                          course.thumbnailUrl,
                                          width: 100,
                                          height: 70,
                                          fit: BoxFit.cover,
                                          errorBuilder: (_, __, ___) => Container(
                                            width: 100,
                                            height: 70,
                                            color: const Color(0xFF1E293B),
                                            child: const Icon(Icons.play_circle_fill_rounded, color: AppTheme.cyan),
                                          ),
                                        ),
                                        Positioned(
                                          bottom: 4,
                                          right: 4,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: Colors.black.withOpacity(0.85),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: Text(
                                              _formatDuration(lesson.durationSeconds),
                                              style: const TextStyle(
                                                fontSize: 9,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ),
                                        ),
                                        // Play Icon Overlay
                                        Positioned.fill(
                                          child: Center(
                                            child: Container(
                                              padding: const EdgeInsets.all(6),
                                              decoration: BoxDecoration(
                                                shape: BoxShape.circle,
                                                color: Colors.black.withOpacity(0.6),
                                              ),
                                              child: const Icon(
                                                Icons.play_arrow_rounded,
                                                color: AppTheme.cyan,
                                                size: 16,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(width: 12),

                                  // Video Metadata
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        // Tags Row
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: AppTheme.cyan.withOpacity(0.12),
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                              child: Text(
                                                course.subject.toUpperCase(),
                                                style: const TextStyle(
                                                  fontSize: 9,
                                                  fontWeight: FontWeight.bold,
                                                  color: AppTheme.cyan,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 6),
                                            if (isCompleted)
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: AppTheme.success.withOpacity(0.15),
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: const Text(
                                                  'COMPLETED',
                                                  style: TextStyle(
                                                    fontSize: 8,
                                                    fontWeight: FontWeight.bold,
                                                    color: AppTheme.success,
                                                  ),
                                                ),
                                              )
                                            else if (isInProgress)
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: const Color(0xFFF59E0B).withOpacity(0.15),
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Text(
                                                  'RESUME ${_formatDuration(lesson.playbackPositionSeconds)}',
                                                  style: const TextStyle(
                                                    fontSize: 8,
                                                    fontWeight: FontWeight.bold,
                                                    color: Color(0xFFF59E0B),
                                                  ),
                                                ),
                                              ),
                                          ],
                                        ),

                                        const SizedBox(height: 6),

                                        // Title
                                        Text(
                                          lesson.title,
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                            height: 1.25,
                                          ),
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),

                                        const SizedBox(height: 4),

                                        // Instructor
                                        Text(
                                          '${course.instructor} • 1080p Full HD',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF94A3B8),
                                          ),
                                        ),

                                        if (isInProgress) ...[
                                          const SizedBox(height: 8),
                                          ClipRRect(
                                            borderRadius: BorderRadius.circular(2),
                                            child: LinearProgressIndicator(
                                              value: lesson.playbackPositionSeconds / lesson.durationSeconds,
                                              backgroundColor: const Color(0xFF1E293B),
                                              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.cyan),
                                              minHeight: 3,
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
