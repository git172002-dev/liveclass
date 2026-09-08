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
  bool _isEmailMode = false;
  final TextEditingController _phoneController = TextEditingController(text: '+91 98765 43210');
  final TextEditingController _emailController = TextEditingController(text: 'client@gmail.com');
  bool _isLoading = false;
  String? _errorMessage;

  void _verifyAndSendOtp() {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final enteredTarget = _isEmailMode ? _emailController.text.trim() : _phoneController.text.trim();

    if (_isEmailMode) {
      if (!enteredTarget.contains('@') || !enteredTarget.contains('.')) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Please enter a valid email address (e.g. client@gmail.com).';
        });
        return;
      }
    } else {
      final digits = enteredTarget.replaceAll(RegExp(r'\D'), '');
      if (digits.length < 10) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Please enter a valid 10-digit mobile phone number.';
        });
        return;
      }
    }

    // Fast simulated API / SMS / Email dispatch call
    Future.delayed(const Duration(milliseconds: 600), () {
      final student = MockDataService().findStudent(enteredTarget);

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
      final dynamicOtp = MockDataService().requestOtp(enteredTarget);

      // Proceed to OTP verification screen
      Navigator.of(context).push(
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => OtpVerificationScreen(
            student: student,
            identifier: enteredTarget,
            isEmail: _isEmailMode,
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
    _emailController.dispose();
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 8),

              // Gen Z Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.cyan.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.cyan.withOpacity(0.3)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.bolt_rounded, color: AppTheme.cyan, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'INSTANT 2FA PASSCODE',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                        color: AppTheme.cyan,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),
              const Text(
                'Enter Credentials',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Receive a real-time 6-digit dynamic OTP verification code directly to your mobile phone or email inbox.',
                style: TextStyle(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),

              // Segmented Switcher: [ 📱 Mobile Phone ] vs [ ✉️ Email Address ]
              Container(
                height: 48,
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFF0E1524),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _isEmailMode = false;
                            _errorMessage = null;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: !_isEmailMode ? AppTheme.cyan : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: !_isEmailMode
                                ? [
                                    BoxShadow(
                                      color: AppTheme.cyan.withOpacity(0.35),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ]
                                : [],
                          ),
                          alignment: Alignment.center,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.phone_android_rounded,
                                size: 16,
                                color: !_isEmailMode ? Colors.black : const Color(0xFF94A3B8),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Mobile Phone',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: !_isEmailMode ? Colors.black : const Color(0xFF94A3B8),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _isEmailMode = true;
                            _errorMessage = null;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: _isEmailMode ? AppTheme.cyan : Colors.transparent,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: _isEmailMode
                                ? [
                                    BoxShadow(
                                      color: AppTheme.cyan.withOpacity(0.35),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ]
                                : [],
                          ),
                          alignment: Alignment.center,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.alternate_email_rounded,
                                size: 16,
                                color: _isEmailMode ? Colors.black : const Color(0xFF94A3B8),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Email Address',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: _isEmailMode ? Colors.black : const Color(0xFF94A3B8),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Error Banner (if any)
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

              // Input Field (Phone or Email)
              Text(
                _isEmailMode ? 'STUDENT EMAIL ADDRESS' : 'REGISTERED MOBILE NUMBER',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.6,
                  color: Color(0xFFCBD5E1),
                ),
              ),
              const SizedBox(height: 8),

              if (!_isEmailMode)
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
                    hintText: '+91 98765 43210',
                    hintStyle: const TextStyle(color: Color(0xFF475569)),
                  ),
                  onChanged: (_) {
                    if (_errorMessage != null) {
                      setState(() {
                        _errorMessage = null;
                      });
                    }
                  },
                )
              else
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                    letterSpacing: 0.2,
                  ),
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.email_outlined, color: AppTheme.cyan, size: 20),
                    suffixIcon: _emailController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, size: 18, color: Color(0xFF64748B)),
                            onPressed: () {
                              setState(() {
                                _emailController.clear();
                                _errorMessage = null;
                              });
                            },
                          )
                        : null,
                    hintText: 'student@example.com',
                    hintStyle: const TextStyle(color: Color(0xFF475569)),
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
                    Row(
                      children: [
                        const Icon(Icons.touch_app_rounded, color: AppTheme.cyan, size: 14),
                        const SizedBox(width: 6),
                        Text(
                          _isEmailMode ? 'TAP DEMO EMAIL FOR TESTING' : 'TAP DEMO MOBILE FOR TESTING',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                            color: AppTheme.cyan,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    if (!_isEmailMode)
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
                              'Client (+919123456789)',
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
                      )
                    else
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          ActionChip(
                            backgroundColor: const Color(0xFF0E1524),
                            side: const BorderSide(color: Color(0xFF334155)),
                            label: const Text(
                              'client@gmail.com',
                              style: TextStyle(fontSize: 11, color: AppTheme.cyan, fontWeight: FontWeight.bold),
                            ),
                            onPressed: () {
                              setState(() {
                                _emailController.text = 'client@gmail.com';
                                _errorMessage = null;
                              });
                            },
                          ),
                          ActionChip(
                            backgroundColor: const Color(0xFF0E1524),
                            side: const BorderSide(color: Color(0xFF334155)),
                            label: const Text(
                              'aarav.patel@example.com',
                              style: TextStyle(fontSize: 11, color: Colors.white),
                            ),
                            onPressed: () {
                              setState(() {
                                _emailController.text = 'aarav.patel@example.com';
                                _errorMessage = null;
                              });
                            },
                          ),
                          ActionChip(
                            backgroundColor: const Color(0xFF0E1524),
                            side: const BorderSide(color: Color(0xFF334155)),
                            label: const Text(
                              'student@aethered.com',
                              style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                            ),
                            onPressed: () {
                              setState(() {
                                _emailController.text = 'student@aethered.com';
                                _errorMessage = null;
                              });
                            },
                          ),
                        ],
                      ),
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _verifyAndSendOtp,
                  child: _isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.black),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _isEmailMode ? 'Send Real-Time Email OTP' : AppStrings.sendOtpButton,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward_rounded, size: 16),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
