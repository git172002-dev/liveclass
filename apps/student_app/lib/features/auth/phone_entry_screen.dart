import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_strings.dart';
import '../../core/services/mock_data_service.dart';
import 'otp_verification_screen.dart';

class PhoneEntryScreen extends StatefulWidget {
  const PhoneEntryScreen({super.key});

  @override
  State<PhoneEntryScreen> createState() => _PhoneEntryScreenState();
}

class _PhoneEntryScreenState extends State<PhoneEntryScreen> {
  final TextEditingController _phoneController = TextEditingController(text: '+91 98765 43210');
  bool _isLoading = false;
  String? _errorMessage;

  void _verifyStudentAndSendOtp() {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final enteredPhone = _phoneController.text.trim();
    final digits = enteredPhone.replaceAll(RegExp(r'\D'), '');

    if (digits.length < 10) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Please enter a valid 10-digit mobile phone number.';
      });
      return;
    }

    // Fast simulated API / SMS dispatch call
    Future.delayed(const Duration(milliseconds: 600), () {
      final student = MockDataService().findStudent(enteredPhone);

      setState(() {
        _isLoading = false;
      });

      if (student != null && student.status != 'active') {
        setState(() {
          _errorMessage = 'Your student account is currently suspended. Please contact your administrator.';
        });
        return;
      }

      // Generate real dynamic 6-digit OTP
      final dynamicOtp = MockDataService().requestOtp(enteredPhone);

      // Authorized student or new student found! Proceed to OTP verification screen
      Navigator.of(context).push(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => OtpVerificationScreen(
            student: student,
            phoneNumber: enteredPhone,
            generatedOtp: dynamicOtp,
          ),
          transitionsBuilder: (_, a, __, c) => FadeTransition(opacity: a, child: c),
        ),
      );
    });
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              const Text(
                AppStrings.enterMobilePrompt,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                AppStrings.enterMobileSubtitle,
                style: TextStyle(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 28),

              // Error Banner (if unauthorized or failed)
              if (_errorMessage != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.error.withOpacity(0.4)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.info_outline_rounded, color: AppTheme.error, size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          _errorMessage!,
                          style: const TextStyle(
                            color: Color(0xFFFCA5A5),
                            fontSize: 12,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Phone Input Field
              const Text(
                AppStrings.mobileLabel,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFCBD5E1),
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  letterSpacing: 0.5,
                ),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.phone_android_rounded, color: AppTheme.cyan, size: 20),
                  suffixIcon: _phoneController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 18, color: Color(0xFF64748B)),
                          onPressed: () {
                            setState(() {
                              _phoneController.clear();
                              _errorMessage = null;
                            });
                          },
                        )
                      : null,
                ),
                onChanged: (_) {
                  if (_errorMessage != null) {
                    setState(() {
                      _errorMessage = null;
                    });
                  }
                },
              ),

              const SizedBox(height: 20),

              // Quick Test Demo Chips
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.darkCardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'QUICK TEST NUMBERS',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                        color: AppTheme.cyan,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        ActionChip(
                          backgroundColor: const Color(0xFF0E1524),
                          side: const BorderSide(color: Color(0xFF334155)),
                          label: const Text(
                            'Aarav (+919876543210)',
                            style: TextStyle(fontSize: 11, color: Colors.white),
                          ),
                          onPressed: () {
                            setState(() {
                              _phoneController.text = '+91 98765 43210';
                              _errorMessage = null;
                            });
                          },
                        ),
                        ActionChip(
                          backgroundColor: const Color(0xFF0E1524),
                          side: const BorderSide(color: Color(0xFF334155)),
                          label: const Text(
                            'New User (+919123456789)',
                            style: TextStyle(fontSize: 11, color: AppTheme.cyan),
                          ),
                          onPressed: () {
                            setState(() {
                              _phoneController.text = '+91 91234 56789';
                              _errorMessage = null;
                            });
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _verifyStudentAndSendOtp,
                  child: _isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.black),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              AppStrings.sendOtpButton,
                              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, size: 16),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
