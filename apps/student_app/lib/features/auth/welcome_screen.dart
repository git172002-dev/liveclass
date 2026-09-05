import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_strings.dart';
import 'phone_entry_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              // Top Brand Tag
              Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [AppTheme.cyan, AppTheme.indigo],
                      ),
                    ),
                    child: const Center(
                      child: Icon(Icons.play_arrow_rounded, color: Colors.black, size: 20),
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Text(
                    AppStrings.appName,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.2,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),

              const Spacer(),

              // Futuristic Decorative Graphic / Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.cyan.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.pad(
                    BorderSide(color: AppTheme.cyan.withOpacity(0.3)),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.cyan,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'HIGH DEFINITION RECORDED CLASSES',
                      style: TextStyle(
                        color: AppTheme.cyan,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              const Text(
                AppStrings.welcomeTitle,
                style: TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.8,
                  height: 1.15,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 14),

              const Text(
                AppStrings.welcomeSubtitle,
                style: TextStyle(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                  height: 1.5,
                ),
              ),

              const SizedBox(height: 36),

              // Feature Highlights Row
              Row(
                children: [
                  _buildPill(Icons.video_library_rounded, 'Chapter Breakdown'),
                  const SizedBox(width: 10),
                  _buildPill(Icons.history_rounded, 'Auto-Resume'),
                ],
              ),

              const Spacer(),

              // Get Started CTA Button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      PageRouteBuilder(
                        pageBuilder: (_, __, ___) => const PhoneEntryScreen(),
                        transitionsBuilder: (_, a, __, c) => FadeTransition(opacity: a, child: c),
                      ),
                    );
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Continue with Mobile Number',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward_rounded, size: 18),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 12),
              const Center(
                child: Text(
                  'Access is restricted to pre-registered enrolled students',
                  style: TextStyle(
                    fontSize: 11,
                    color: Color(0xFF64748B),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPill(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.darkCardBorder),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppTheme.cyan),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppTheme.textPrimary, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
