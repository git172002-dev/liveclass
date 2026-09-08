import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_strings.dart';
import '../../core/models/student_models.dart';
import '../../core/services/mock_data_service.dart';
import '../courses/course_detail_screen.dart';
import '../player/video_player_screen.dart';
import '../profile/profile_screen.dart';
import '../live/live_class_screen.dart';
import '../library/video_library_screen.dart';
import '../common/responsive_layout.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final MockDataService _dataService = MockDataService();
  int _currentNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    final student = _dataService.currentStudent ?? _dataService.registeredStudents[0];
    final isExpired = !student.isAccessActive;
    final isTablet = ResponsiveLayout.isTablet(context);

    if (isTablet) {
      return Scaffold(
        backgroundColor: AppTheme.darkBg,
        body: SafeArea(
          child: Row(
            children: [
              // Tablet / iPad Navigation Rail
              NavigationRail(
                backgroundColor: const Color(0xFF0B101D),
                indicatorColor: AppTheme.cyan.withOpacity(0.15),
                selectedIndex: _currentNavIndex,
                onDestinationSelected: (index) {
                  setState(() {
                    _currentNavIndex = index;
                  });
                },
                leading: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppTheme.cyan, Color(0xFF2563EB)],
                      ),
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.cyan.withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.auto_awesome, color: Colors.black, size: 22),
                  ),
                ),
                trailing: Expanded(
                  child: Align(
                    alignment: Alignment.bottomCenter,
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppTheme.success,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'SYNC',
                            style: TextStyle(
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.success,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                destinations: const [
                  NavigationRailDestination(
                    icon: Icon(Icons.home_outlined, color: Color(0xFF94A3B8)),
                    selectedIcon: Icon(Icons.home_rounded, color: AppTheme.cyan),
                    label: Text('Classes'),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.video_library_outlined, color: Color(0xFF94A3B8)),
                    selectedIcon: Icon(Icons.video_library_rounded, color: AppTheme.cyan),
                    label: Text('Library'),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.videocam_outlined, color: Color(0xFF94A3B8)),
                    selectedIcon: Icon(Icons.videocam_rounded, color: AppTheme.cyan),
                    label: Text('Live Class'),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.person_outline_rounded, color: Color(0xFF94A3B8)),
                    selectedIcon: Icon(Icons.person_rounded, color: AppTheme.cyan),
                    label: Text('Profile'),
                  ),
                ],
              ),
              const VerticalDivider(width: 1, color: AppTheme.darkCardBorder),
              Expanded(
                child: _buildNavBody(context, student, isExpired),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      body: SafeArea(
        child: _buildNavBody(context, student, isExpired),
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF0B101D),
          border: Border(top: BorderSide(color: AppTheme.darkCardBorder, width: 1)),
        ),
        child: NavigationBar(
          backgroundColor: Colors.transparent,
          indicatorColor: AppTheme.cyan.withOpacity(0.15),
          selectedIndex: _currentNavIndex,
          onDestinationSelected: (index) {
            setState(() {
              _currentNavIndex = index;
            });
          },
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.home_rounded, color: AppTheme.cyan),
              label: 'Classes',
            ),
            NavigationDestination(
              icon: Icon(Icons.video_library_outlined, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.video_library_rounded, color: AppTheme.cyan),
              label: 'Library',
            ),
            NavigationDestination(
              icon: Badge(
                backgroundColor: Color(0xFFEF4444),
                smallSize: 8,
                child: Icon(Icons.videocam_outlined, color: Color(0xFF94A3B8)),
              ),
              selectedIcon: Badge(
                backgroundColor: Color(0xFFEF4444),
                smallSize: 8,
                child: Icon(Icons.videocam_rounded, color: AppTheme.cyan),
              ),
              label: 'Live Class',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline_rounded, color: Color(0xFF94A3B8)),
              selectedIcon: Icon(Icons.person_rounded, color: AppTheme.cyan),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavBody(BuildContext context, StudentModel student, bool isExpired) {
    switch (_currentNavIndex) {
      case 0:
        return _buildHomeContent(context, student, isExpired);
      case 1:
        return VideoLibraryScreen(onBack: () => setState(() => _currentNavIndex = 0));
      case 2:
        return LiveClassScreen(onBack: () => setState(() => _currentNavIndex = 0));
      case 3:
        return const ProfileScreen();
      default:
        return _buildHomeContent(context, student, isExpired);
    }
  }

  Widget _buildHomeContent(BuildContext context, StudentModel student, bool isExpired) {
    final continueLesson = _dataService.getContinueLesson();
    final continueCourse = _dataService.courses.firstWhere(
      (c) => c.id == continueLesson?.courseId,
      orElse: () => _dataService.courses.first,
    );

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: ResponsiveLayout.getHorizontalPadding(context),
        vertical: 18,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Header: Greeting & Profile Avatar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Good evening, ${student.name.split(' ').first} 👋',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    student.activePlanName ?? 'Enrolled Student',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.cyan,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () {
                  setState(() {
                    _currentNavIndex = 1;
                  });
                },
                child: Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [AppTheme.cyan, AppTheme.indigo],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.cyan.withOpacity(0.3),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      student.name.isNotEmpty ? student.name.substring(0, 1) : 'S',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Gen Z Gamification Bar (Streaks & XP)
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF0E1524),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('🔥', style: TextStyle(fontSize: 14)),
                    SizedBox(width: 6),
                    Text(
                      '4-DAY STREAK',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                        color: Color(0xFFF97316),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF0E1524),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('⚡', style: TextStyle(fontSize: 14)),
                    SizedBox(width: 6),
                    Text(
                      '1,420 XP',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                        color: AppTheme.cyan,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              GestureDetector(
                onTap: () => setState(() => _currentNavIndex = 1),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.cyan.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.cyan.withOpacity(0.3)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.video_library_rounded, size: 14, color: AppTheme.cyan),
                      SizedBox(width: 4),
                      Text(
                        'Video Vault',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.cyan,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Pulsing 🔴 LIVE NOW Hero Card (Zoom-Like Live Class)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFFEF4444).withOpacity(0.15),
                  const Color(0xFF0B101D),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.5)),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFEF4444).withOpacity(0.15),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF4444),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.circle, size: 8, color: Colors.white),
                          SizedBox(width: 4),
                          Text(
                            'LIVE CLASS STREAMING',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.8,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Row(
                      children: [
                        Icon(Icons.people_alt_rounded, size: 13, color: AppTheme.cyan),
                        SizedBox(width: 4),
                        Text(
                          '34 Students in Room',
                          style: TextStyle(fontSize: 11, color: AppTheme.cyan, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Physics Class 12: Electromagnetic Waves & Optics Live Doubt Solving',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Dr. Vikram Seth • Zoom/Jitsi Video Bridge Active (+50 XP)',
                  style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => setState(() => _currentNavIndex = 2),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEF4444),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        icon: const Icon(Icons.videocam_rounded, size: 16),
                        label: const Text(
                          'Join Live Classroom',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    OutlinedButton.icon(
                      onPressed: () => setState(() => _currentNavIndex = 1),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.cyan,
                        side: BorderSide(color: AppTheme.cyan.withOpacity(0.5)),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.video_library_rounded, size: 15),
                      label: const Text(
                        'Video Vault',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Expired Access Banner (if applicable)
          if (isExpired) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.error.withOpacity(0.12),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.error.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lock_clock_rounded, color: AppTheme.error, size: 28),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Subscription Expired',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 3),
                        Text(
                          AppStrings.errAccessExpired,
                          style: TextStyle(fontSize: 11, color: Color(0xFFFCA5A5), height: 1.3),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],

          // "Continue Learning" Hero Card
          if (!isExpired && continueLesson != null) ...[
            const Row(
              children: [
                Icon(Icons.play_circle_fill_rounded, color: AppTheme.cyan, size: 18),
                SizedBox(width: 8),
                Text(
                  AppStrings.continueLearning,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.2,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: const LinearGradient(
                  colors: [Color(0xFF131D33), Color(0xFF0F172A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                border: Border.all(color: AppTheme.cyan.withOpacity(0.3)),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.cyan.withOpacity(0.08),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            width: 72,
                            height: 72,
                            color: const Color(0xFF1E293B),
                            child: Image.network(
                              continueCourse.thumbnailUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => const Icon(Icons.video_library, color: AppTheme.cyan),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppTheme.cyan.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  continueCourse.subject.toUpperCase(),
                                  style: const TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.cyan,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                continueLesson.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${continueCourse.title} • ${continueCourse.instructor}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Progress Bar & Resume Indicator
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Continue from ${_formatSeconds(continueLesson.playbackPositionSeconds)}',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.cyan,
                              ),
                            ),
                            Text(
                              continueLesson.durationFormatted,
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: continueLesson.playbackPositionSeconds / continueLesson.durationSeconds,
                            backgroundColor: const Color(0xFF1E293B),
                            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.cyan),
                            minHeight: 5,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Resume Button
                    SizedBox(
                      width: double.infinity,
                      height: 44,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.cyan,
                          foregroundColor: Colors.black,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => VideoPlayerScreen(
                                lesson: continueLesson,
                                courseTitle: continueCourse.title,
                              ),
                            ),
                          );
                        },
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.play_arrow_rounded, size: 20),
                            SizedBox(width: 6),
                            Text(
                              'Resume Lecture',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 28),
          ],

          // "My Courses" Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'My Purchased Courses',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.3,
                  color: Colors.white,
                ),
              ),
              Text(
                '${_dataService.getPurchasedCourses(student).length} Active',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.cyan,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Course Cards
          Builder(
            builder: (context) {
              final purchased = _dataService.getPurchasedCourses(student);
              if (purchased.isEmpty) {
                return Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.darkCard,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppTheme.darkCardBorder),
                  ),
                  child: Column(
                    children: const [
                      Icon(Icons.video_library_outlined, size: 36, color: Color(0xFF64748B)),
                      SizedBox(height: 8),
                      Text(
                        'No Purchased Courses Found',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'You are not enrolled in any active courses. Contact admin to activate your plan.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                      ),
                    ],
                  ),
                );
              }

              final colCount = ResponsiveLayout.getGridColumnCount(context);
              if (colCount > 1) {
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: purchased.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: colCount,
                    childAspectRatio: 2.3,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  itemBuilder: (context, index) {
                    final course = purchased[index];
                    return _buildCourseCard(context, course, isExpired);
                  },
                );
              }

              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: purchased.length,
                separatorBuilder: (_, __) => const SizedBox(height: 14),
                itemBuilder: (context, index) {
                  final course = purchased[index];
                  return _buildCourseCard(context, course, isExpired);
                },
              );
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildCourseCard(BuildContext context, CourseModel course, bool isExpired) {
    return GestureDetector(
      onTap: () {
        if (isExpired) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(AppStrings.errAccessExpired),
              backgroundColor: AppTheme.error,
            ),
          );
          return;
        }

        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => CourseDetailScreen(course: course),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.darkCardBorder),
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: SizedBox(
                  width: 84,
                  height: 84,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(
                        course.thumbnailUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          color: const Color(0xFF1E293B),
                          child: const Icon(Icons.school_rounded, color: AppTheme.cyan),
                        ),
                      ),
                      if (isExpired)
                        Container(
                          color: Colors.black.withOpacity(0.6),
                          child: const Center(
                            child: Icon(Icons.lock_rounded, color: Colors.white, size: 24),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          course.subject.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.cyan,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text('•', style: TextStyle(color: Color(0xFF475569))),
                        const SizedBox(width: 6),
                        Text(
                          '${course.lessons.length} Lessons',
                          style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 5),
                    Text(
                      course.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      course.instructor,
                      style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Color(0xFF475569)),
            ],
          ),
        ),
      ),
    );
  }

  String _formatSeconds(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }
}
