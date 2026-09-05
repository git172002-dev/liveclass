import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_strings.dart';
import '../../core/services/mock_data_service.dart';
import '../auth/welcome_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isDarkMode = true;

  @override
  Widget build(BuildContext context) {
    final student = MockDataService().currentStudent ?? MockDataService().registeredStudents[0];
    final isAccessActive = student.isAccessActive;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            AppStrings.profileTitle,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.4,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),

          // Profile Header Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.darkCardBorder),
            ),
            child: Row(
              children: [
                Container(
                  width: 58,
                  height: 58,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [AppTheme.cyan, AppTheme.indigo],
                    ),
                  ),
                  child: Center(
                    child: Text(
                      student.name.isNotEmpty ? student.name.substring(0, 1) : 'S',
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        student.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        student.mobileNumber,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.cyan,
                          fontFamily: 'monospace',
                        ),
                      ),
                      if (student.email != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          student.email!,
                          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Subscription & Access Status Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isAccessActive ? AppTheme.darkCardBorder : AppTheme.error.withOpacity(0.4),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      AppStrings.subscriptionStatus,
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: isAccessActive
                            ? AppTheme.success.withOpacity(0.12)
                            : AppTheme.error.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isAccessActive ? AppTheme.success : AppTheme.error,
                        ),
                      ),
                      child: Text(
                        isAccessActive ? 'ACTIVE ACCESS' : 'EXPIRED',
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: isAccessActive ? AppTheme.success : AppTheme.error,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  student.activePlanName ?? 'Standard Access',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 6),
                Text(
                  student.expiryDate != null
                      ? 'Access Valid Until: ${student.expiryDate!.day}/${student.expiryDate!.month}/${student.expiryDate!.year}'
                      : 'Lifetime Access granted by Admin',
                  style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                ),
                if (!isAccessActive) ...[
                  const SizedBox(height: 12),
                  const Text(
                    AppStrings.errAccessExpired,
                    style: TextStyle(fontSize: 11, color: Color(0xFFFCA5A5), height: 1.4),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Settings Section
          Container(
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.darkCardBorder),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text(
                    AppStrings.darkTheme,
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
                  ),
                  subtitle: const Text(
                    'Futuristic Deep Dark Mode',
                    style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                  value: _isDarkMode,
                  activeColor: AppTheme.cyan,
                  onChanged: (val) {
                    setState(() {
                      _isDarkMode = val;
                    });
                  },
                ),
                const Divider(height: 1, color: Color(0xFF1E293B)),
                ListTile(
                  leading: const Icon(Icons.support_agent_rounded, color: AppTheme.cyan, size: 20),
                  title: const Text(
                    AppStrings.contactAdmin,
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
                  ),
                  subtitle: const Text(
                    'For subscription renewal or course enrollment',
                    style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Color(0xFF64748B)),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Please contact your administrator at admin@aethered.com'),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // Sign Out Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFFEF4444), width: 1),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              icon: const Icon(Icons.logout_rounded, size: 18, color: Color(0xFFEF4444)),
              label: const Text(
                AppStrings.signOut,
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFFEF4444)),
              ),
              onPressed: () {
                MockDataService().currentStudent = null;
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const WelcomeScreen()),
                  (route) => false,
                );
              },
            ),
          ),

          const SizedBox(height: 24),
          Center(
            child: Text(
              'AetherEd Mobile V1.0 • Build 2026.1',
              style: TextStyle(fontSize: 10, color: Colors.white.withOpacity(0.3)),
            ),
          ),
        ],
      ),
    );
  }
}
