import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';
import '../../core/models/student_models.dart';
import '../../core/services/mock_data_service.dart';

class VideoPlayerScreen extends StatefulWidget {
  final LessonModel lesson;
  final String courseTitle;

  const VideoPlayerScreen({
    super.key,
    required this.lesson,
    required this.courseTitle,
  });

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  bool _isPlaying = true;
  int _currentSeconds = 0;
  late int _totalSeconds;
  double _playbackSpeed = 1.0;
  bool _isFullscreen = false;
  Timer? _ticker;

  final List<double> _speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  @override
  void initState() {
    super.initState();
    _totalSeconds = widget.lesson.durationSeconds;
    _currentSeconds = widget.lesson.playbackPositionSeconds;

    // Check if resuming from previous position (Section 9 requirement: "Continue from 18:42?")
    if (_currentSeconds > 30 && !widget.lesson.isCompleted) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showResumeDialog();
      });
    }

    _startPlaybackSimulation();
  }

  void _showResumeDialog() {
    final formattedTime = _formatDuration(_currentSeconds);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.darkCard,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppTheme.darkCardBorder),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.cyan.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.history_rounded, color: AppTheme.cyan, size: 20),
            ),
            const SizedBox(width: 12),
            const Text(
              'Resume Lecture',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ],
        ),
        content: Text(
          'Would you like to continue from $formattedTime?',
          style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _currentSeconds = 0;
              });
              Navigator.of(ctx).pop();
            },
            child: const Text('Start Over', style: TextStyle(color: Color(0xFF94A3B8))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.cyan,
              foregroundColor: Colors.black,
            ),
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: Text('Continue ($formattedTime)'),
          ),
        ],
      ),
    );
  }

  void _startPlaybackSimulation() {
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_isPlaying && mounted) {
        setState(() {
          if (_currentSeconds < _totalSeconds) {
            _currentSeconds += 1;
          } else {
            _isPlaying = false;
          }
        });
      }
    });
  }

  void _seekRelative(int deltaSeconds) {
    setState(() {
      _currentSeconds = (_currentSeconds + deltaSeconds).clamp(0, _totalSeconds);
    });
  }

  void _toggleFullscreen() {
    setState(() {
      _isFullscreen = !_isFullscreen;
    });

    if (_isFullscreen) {
      SystemChrome.setPreferredOrientations([
        DeviceOrientation.landscapeLeft,
        DeviceOrientation.landscapeRight,
      ]);
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
    } else {
      SystemChrome.setPreferredOrientations([
        DeviceOrientation.portraitUp,
      ]);
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    }
  }

  void _saveProgressAndExit() {
    final isCompleted = (_currentSeconds / _totalSeconds) >= 0.90;
    MockDataService().updateProgress(widget.lesson.id, _currentSeconds, isCompleted);
    if (_isFullscreen) {
      _toggleFullscreen();
    }
    Navigator.of(context).pop();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    // Revert system UI orientation
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    super.dispose();
  }

  String _formatDuration(int totalSecs) {
    final mins = totalSecs ~/ 60;
    final secs = totalSecs % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        _saveProgressAndExit();
        return false;
      },
      child: Scaffold(
        backgroundColor: Colors.black,
        body: SafeArea(
          child: Column(
            children: [
              // Top Video Stream Player Container
              Expanded(
                flex: _isFullscreen ? 1 : 0,
                child: Container(
                  height: _isFullscreen ? double.infinity : 240,
                  width: double.infinity,
                  color: Colors.black,
                  child: Stack(
                    children: [
                      // Video Placeholder Surface
                      Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 64,
                              height: 64,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: AppTheme.cyan.withOpacity(0.15),
                                border: Border.all(color: AppTheme.cyan.withOpacity(0.4)),
                              ),
                              child: Center(
                                child: Icon(
                                  _isPlaying ? Icons.pause_rounded : Icons.play_arrow_rounded,
                                  color: AppTheme.cyan,
                                  size: 36,
                                ),
                              ),
                            ),
                            const SizedBox(height: 10),
                            const Text(
                              'Secure Stream via Cloudflare R2',
                              style: TextStyle(
                                fontSize: 11,
                                color: Color(0xFF64748B),
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Overlay Controls: Top Bar
                      Positioned(
                        top: 10,
                        left: 10,
                        right: 10,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
                              onPressed: _saveProgressAndExit,
                            ),
                            // Playback Speed Selector
                            PopupMenuButton<double>(
                              initialValue: _playbackSpeed,
                              onSelected: (speed) {
                                setState(() {
                                  _playbackSpeed = speed;
                                });
                              },
                              color: AppTheme.darkCard,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              itemBuilder: (context) => _speeds.map((s) {
                                return PopupMenuItem(
                                  value: s,
                                  child: Text('${s}x', style: const TextStyle(color: Colors.white, fontSize: 12)),
                                );
                              }).toList(),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: const Color(0xFF334155)),
                                ),
                                child: Text(
                                  '${_playbackSpeed}x',
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.cyan),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Overlay Controls: Bottom Bar with Slider
                      Positioned(
                        bottom: 6,
                        left: 12,
                        right: 12,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            SliderTheme(
                              data: SliderTheme.of(context).copyWith(
                                trackHeight: 3,
                                thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                                activeTrackColor: AppTheme.cyan,
                                inactiveTrackColor: const Color(0xFF334155),
                                thumbColor: AppTheme.cyan,
                              ),
                              child: Slider(
                                value: _currentSeconds.toDouble(),
                                min: 0,
                                max: _totalSeconds.toDouble(),
                                onChanged: (val) {
                                  setState(() {
                                    _currentSeconds = val.toInt();
                                  });
                                },
                              ),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.replay_10_rounded, color: Colors.white, size: 22),
                                      onPressed: () => _seekRelative(-10),
                                    ),
                                    IconButton(
                                      icon: Icon(
                                        _isPlaying ? Icons.pause_rounded : Icons.play_arrow_rounded,
                                        color: Colors.white,
                                        size: 28,
                                      ),
                                      onPressed: () {
                                        setState(() {
                                          _isPlaying = !_isPlaying;
                                        });
                                      },
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.forward_10_rounded, color: Colors.white, size: 22),
                                      onPressed: () => _seekRelative(10),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '${_formatDuration(_currentSeconds)} / ${_formatDuration(_totalSeconds)}',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: Colors.white,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ],
                                ),
                                IconButton(
                                  icon: Icon(
                                    _isFullscreen ? Icons.fullscreen_exit_rounded : Icons.fullscreen_rounded,
                                    color: Colors.white,
                                    size: 24,
                                  ),
                                  onPressed: _toggleFullscreen,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Details Section (Visible in portrait mode)
              if (!_isFullscreen)
                Expanded(
                  child: Container(
                    color: AppTheme.darkBg,
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.courseTitle,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.cyan,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          widget.lesson.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          widget.lesson.description,
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppTheme.textSecondary,
                            height: 1.5,
                          ),
                        ),
                        const Spacer(),

                        // Mark Lesson Complete Button
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF1E293B),
                              foregroundColor: AppTheme.cyan,
                              side: const BorderSide(color: AppTheme.cyan, width: 1),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                            label: const Text(
                              'Save Progress & Complete',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            onPressed: () {
                              _currentSeconds = _totalSeconds;
                              _saveProgressAndExit();
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
