import 'package:flutter_test/flutter_test.dart';
import 'package:aethered_student_app/core/services/mock_data_service.dart';

void main() {
  group('MockDataService 2FA & Onboarding Tests', () {
    final service = MockDataService();

    test('Generates dynamic 6-digit OTP', () {
      final otp = service.requestOtp('+919999988888');
      expect(otp.length, 6);
      expect(int.tryParse(otp), isNotNull);
    });

    test('Verifies dynamic OTP correctly', () {
      final otp = service.requestOtp('+919999988888');
      expect(service.verifyOtp('+919999988888', '000000'), isFalse);
      expect(service.verifyOtp('+919999988888', otp), isTrue);
    });

    test('Auto-registers new student and grants access', () {
      final student = service.getOrCreateStudent('+919111122222', name: 'Test Student');
      expect(student.name, 'Test Student');
      expect(student.isAccessActive, isTrue);
      final courses = service.getPurchasedCourses(student);
      expect(courses.isNotEmpty, isTrue);
    });
  });
}
