import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_theme.dart';
import '../../core/services/mock_data_service.dart';

class LiveClassScreen extends StatefulWidget {
  final VoidCallback? onBack;

  const LiveClassScreen({super.key, this.onBack});

  @override
  State<LiveClassScreen> createState() => _LiveClassScreenState();
}

class _LiveClassScreenState extends State<LiveClassScreen> with SingleTickerProviderStateMixin {
  final MockDataService _dataService = MockDataService();
  final TextEditingController _chatController = TextEditingController();
  final ScrollController _chatScrollController = ScrollController();

  bool _isMicMuted = true;
  bool _isCameraOff = true;
  bool _isHandRaised = false;
  bool _showChat = true;
  int _attendeesCount = 34;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  final List<Map<String, dynamic>> _chatMessages = [
    {
      'sender': 'Dr. Vikram Seth',
      'isHost': true,
      'text': 'Welcome everyone! Today we will break down Electromagnetic Induction and Wave Optics.',
      'time': '18:30',
    },
    {
      'sender': 'Aarav Patel',
      'isHost': false,
      'text': 'Sir, could you please clarify the Lenz Law negative sign in Faraday formula?',
      'time': '18:32',
    },
    {
      'sender': 'Priya Sharma',
      'isHost': false,
      'text': 'The wavefront animation on slide 4 makes Huygens principle so clear! 🔥',
      'time': '18:34',
    },
    {
      'sender': 'Neha Sundaram',
      'isHost': false,
      'text': 'Will this live session be available in the In-App Video Library afterwards?',
      'time': '18:35',
    },
    {
      'sender': 'Dr. Vikram Seth',
      'isHost': true,
      'text': 'Yes! Full 4K recording will be synced to your Library tab automatically ⚡',
      'time': '18:36',
    },
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _chatController.dispose();
    _chatScrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;

    final student = _dataService.currentStudent ?? _dataService.registeredStudents[0];
    final now = DateTime.now();
    final timeStr = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';

    setState(() {
      _chatMessages.add({
        'sender': student.name,
        'isHost': false,
        'text': text,
        'time': timeStr,
      });
      _chatController.clear();
    });

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_chatScrollController.hasClients) {
        _chatScrollController.animateTo(
          _chatScrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _toggleRaiseHand() {
    setState(() {
      _isHandRaised = !_isHandRaised;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: _isHandRaised ? const Color(0xFF1E293B) : const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: _isHandRaised ? const Color(0xFFF59E0B) : const Color(0xFF334155),
          ),
        ),
        content: Row(
          children: [
            Icon(
              _isHandRaised ? Icons.pan_tool_rounded : Icons.pan_tool_outlined,
              color: _isHandRaised ? const Color(0xFFF59E0B) : const Color(0xFF94A3B8),
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                _isHandRaised
                    ? 'Hand raised! Instructor Dr. Vikram Seth has been notified. ✋'
                    : 'Hand lowered.',
                style: const TextStyle(fontSize: 13, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _copyRoomUrl() {
    Clipboard.setData(ClipboardData(text: _dataService.liveClassRoomUrl));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF0E1524),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: AppTheme.cyan),
        ),
        content: const Row(
          children: [
            Icon(Icons.check_circle_outline_rounded, color: AppTheme.cyan, size: 20),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'Live Video Room URL copied to clipboard! Open in Zoom or browser.',
                style: TextStyle(fontSize: 13, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
        title: Row(
          children: [
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _pulseAnimation.value,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF4444).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFFEF4444)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.circle, color: Color(0xFFEF4444), size: 8),
                        SizedBox(width: 4),
                        Text(
                          'LIVE',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.8,
                            color: Color(0xFFEF4444),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Physics Class 12 • Live Classroom',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    '${_dataService.liveClassInstructor} • $_attendeesCount Enrolled Live',
                    style: const TextStyle(fontSize: 11, color: AppTheme.cyan),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppTheme.cyan, size: 20),
            tooltip: 'Copy Live Room Link',
            onPressed: _copyRoomUrl,
          ),
          IconButton(
            icon: Icon(
              _showChat ? Icons.chat_bubble : Icons.chat_bubble_outline,
              color: _showChat ? AppTheme.cyan : const Color(0xFF94A3B8),
              size: 20,
            ),
            tooltip: 'Toggle Live Chat',
            onPressed: () {
              setState(() {
                _showChat = !_showChat;
              });
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Live Video Player / Broadcast Viewport
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                color: Colors.black,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Simulated High-Definition Video Stream Background
                    Container(
                      decoration: const BoxDecoration(
                        gradient: RadialGradient(
                          center: Alignment.center,
                          radius: 1.0,
                          colors: [
                            Color(0xFF1E293B),
                            Color(0xFF090D16),
                          ],
                        ),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Stack(
                              alignment: Alignment.center,
                              children: [
                                Container(
                                  width: 80,
                                  height: 80,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(color: AppTheme.cyan.withOpacity(0.6), width: 2),
                                    boxShadow: [
                                      BoxShadow(
                                        color: AppTheme.cyan.withOpacity(0.3),
                                        blurRadius: 20,
                                        spreadRadius: 2,
                                      ),
                                    ],
                                  ),
                                  child: const CircleAvatar(
                                    backgroundColor: Color(0xFF0F172A),
                                    child: Icon(Icons.person_rounded, size: 48, color: AppTheme.cyan),
                                  ),
                                ),
                                Positioned(
                                  bottom: 0,
                                  right: 0,
                                  child: Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: AppTheme.success,
                                    ),
                                    child: const Icon(Icons.mic, size: 12, color: Colors.black),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              _dataService.liveClassInstructor,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.cyan.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'PRESENTING • ELECTROMAGNETISM & WAVE OPTICS',
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.6,
                                  color: AppTheme.cyan,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Top Overlay: Stream Quality & Attendance
                    Positioned(
                      top: 12,
                      left: 12,
                      right: 12,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.6),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.white12),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.hd_rounded, size: 14, color: AppTheme.cyan),
                                SizedBox(width: 4),
                                Text(
                                  '1080p • 60 FPS',
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.6),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.white12),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.people_alt_rounded, size: 13, color: AppTheme.success),
                                const SizedBox(width: 5),
                                Text(
                                  '$_attendeesCount in room',
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.white),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Bottom Overlay: Live Jitsi/Zoom launch pill
                    Positioned(
                      bottom: 12,
                      left: 12,
                      right: 12,
                      child: Row(
                        children: [
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: const Color(0xFF090D16).withOpacity(0.85),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppTheme.cyan.withOpacity(0.3)),
                              ),
                              child: const Row(
                                children: [
                                  Icon(Icons.video_camera_front_rounded, size: 14, color: AppTheme.cyan),
                                  SizedBox(width: 6),
                                  Expanded(
                                    child: Text(
                                      'Jitsi Meet Video Bridge Connected',
                                      style: TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.w500),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton.icon(
                            onPressed: _copyRoomUrl,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.cyan,
                              foregroundColor: Colors.black,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            icon: const Icon(Icons.open_in_new_rounded, size: 12),
                            label: const Text(
                              'Zoom Link',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // 2. Interactive In-Call Action Toolbar (Mute, Camera, Raise Hand, Reactions)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: const BoxDecoration(
                color: Color(0xFF0B101D),
                border: Border(
                  bottom: BorderSide(color: AppTheme.darkCardBorder, width: 1),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  // Mic Toggle
                  IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: _isMicMuted ? const Color(0xFF1E293B) : AppTheme.cyan,
                      foregroundColor: _isMicMuted ? const Color(0xFF94A3B8) : Colors.black,
                      padding: const EdgeInsets.all(10),
                    ),
                    icon: Icon(_isMicMuted ? Icons.mic_off_rounded : Icons.mic_rounded, size: 18),
                    tooltip: _isMicMuted ? 'Unmute Mic' : 'Mute Mic',
                    onPressed: () {
                      setState(() {
                        _isMicMuted = !_isMicMuted;
                      });
                    },
                  ),

                  // Camera Toggle
                  IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: _isCameraOff ? const Color(0xFF1E293B) : AppTheme.cyan,
                      foregroundColor: _isCameraOff ? const Color(0xFF94A3B8) : Colors.black,
                      padding: const EdgeInsets.all(10),
                    ),
                    icon: Icon(_isCameraOff ? Icons.videocam_off_rounded : Icons.videocam_rounded, size: 18),
                    tooltip: _isCameraOff ? 'Turn Video On' : 'Turn Video Off',
                    onPressed: () {
                      setState(() {
                        _isCameraOff = !_isCameraOff;
                      });
                    },
                  ),

                  // Raise Hand (Interactive)
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isHandRaised ? const Color(0xFFF59E0B) : const Color(0xFF1E293B),
                      foregroundColor: _isHandRaised ? Colors.black : Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: _isHandRaised ? 6 : 0,
                    ),
                    icon: Icon(
                      _isHandRaised ? Icons.pan_tool_rounded : Icons.pan_tool_outlined,
                      size: 16,
                      color: _isHandRaised ? Colors.black : const Color(0xFFF59E0B),
                    ),
                    label: Text(
                      _isHandRaised ? 'Hand Raised' : 'Raise Hand',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    onPressed: _toggleRaiseHand,
                  ),

                  // Gamified XP Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppTheme.cyan.withOpacity(0.15), const Color(0xFF2563EB).withOpacity(0.15)],
                      ),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.cyan.withOpacity(0.3)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.bolt_rounded, size: 14, color: AppTheme.cyan),
                        SizedBox(width: 4),
                        Text(
                          '+50 XP',
                          style: TextStyle(
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
            ),

            // 3. Real-Time Classroom Chat Feed
            Expanded(
              child: Container(
                color: const Color(0xFF080C14),
                child: Column(
                  children: [
                    // Chat Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: const BoxDecoration(
                        color: Color(0xFF0B101D),
                        border: Border(bottom: BorderSide(color: Color(0xFF1E293B))),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.chat_bubble_outline_rounded, size: 14, color: AppTheme.cyan),
                              SizedBox(width: 8),
                              Text(
                                'LIVE CLASSROOM Q&A CHAT',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.8,
                                  color: Color(0xFF94A3B8),
                                ),
                              ),
                            ],
                          ),
                          Text(
                            '${_chatMessages.length} messages',
                            style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),

                    // Chat messages list
                    Expanded(
                      child: ListView.builder(
                        controller: _chatScrollController,
                        padding: const EdgeInsets.all(16),
                        itemCount: _chatMessages.length,
                        itemBuilder: (context, index) {
                          final msg = _chatMessages[index];
                          final isHost = msg['isHost'] == true;

                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                CircleAvatar(
                                  radius: 14,
                                  backgroundColor: isHost
                                      ? AppTheme.cyan.withOpacity(0.2)
                                      : const Color(0xFF1E293B),
                                  child: Text(
                                    msg['sender'][0],
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: isHost ? AppTheme.cyan : Colors.white,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            msg['sender'],
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                              color: isHost ? AppTheme.cyan : Colors.white,
                                            ),
                                          ),
                                          if (isHost) ...[
                                            const SizedBox(width: 6),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                              decoration: BoxDecoration(
                                                color: AppTheme.cyan,
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                              child: const Text(
                                                'TEACHER',
                                                style: TextStyle(
                                                  fontSize: 8,
                                                  fontWeight: FontWeight.w900,
                                                  color: Colors.black,
                                                ),
                                              ),
                                            ),
                                          ],
                                          const Spacer(),
                                          Text(
                                            msg['time'],
                                            style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 3),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: isHost
                                              ? AppTheme.cyan.withOpacity(0.08)
                                              : const Color(0xFF0F172A),
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(
                                            color: isHost
                                                ? AppTheme.cyan.withOpacity(0.2)
                                                : const Color(0xFF1E293B),
                                          ),
                                        ),
                                        child: Text(
                                          msg['text'],
                                          style: const TextStyle(fontSize: 12, color: Color(0xFFCBD5E1), height: 1.3),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),

                    // Chat Input Row
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: const BoxDecoration(
                        color: Color(0xFF0B101D),
                        border: Border(top: BorderSide(color: Color(0xFF1E293B))),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _chatController,
                              style: const TextStyle(fontSize: 13, color: Colors.white),
                              decoration: InputDecoration(
                                hintText: 'Ask Dr. Vikram Seth a question...',
                                hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                filled: true,
                                fillColor: const Color(0xFF080C14),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: const BorderSide(color: Color(0xFF1E293B)),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: const BorderSide(color: Color(0xFF1E293B)),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: const BorderSide(color: AppTheme.cyan),
                                ),
                              ),
                              onSubmitted: (_) => _sendMessage(),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            style: IconButton.styleFrom(
                              backgroundColor: AppTheme.cyan,
                              foregroundColor: Colors.black,
                              padding: const EdgeInsets.all(10),
                            ),
                            icon: const Icon(Icons.send_rounded, size: 16),
                            onPressed: _sendMessage,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
