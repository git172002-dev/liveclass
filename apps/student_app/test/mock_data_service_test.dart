import 'package:flutter_test/flutter_test.dart';
import 'package:aethered_student_app/core/services/mock_data_service.dart';

void main() {
  group('MockDataService 2FA, Email OTP & Live Classroom Tests', () {
    final service = MockDataService();

    test('Generates dynamic 6-digit Phone OTP', () {
      final otp = service.requestOtp('+919999988888');
      expect(otp.length, 6);
      expect(int.tryParse(otp), isNotNull);
    });

    test('Verifies dynamic Phone OTP correctly', () {
      final otp = service.requestOtp('+919999988888');
      expect(service.verifyOtp('+919999988888', '000000'), isFalse);
      expect(service.verifyOtp('+919999988888', otp), isTrue);
    });

    test('Generates and verifies Email OTP', () {
      const email = 'client@example.com';
      final otp = service.requestEmailOtp(email);
      expect(otp.length, 6);
      expect(int.tryParse(otp), isNotNull);
      expect(service.verifyEmailOtp(email, '000000'), isFalse);
      expect(service.verifyEmailOtp(email, otp), isTrue);
    });

    test('Auto-registers new student via email and grants curriculum access', () {
      final student = service.getOrCreateStudent('client@example.com', name: 'Client Demo');
      expect(student.name, 'Client Demo');
      expect(student.email, 'client@example.com');
      expect(student.isAccessActive, isTrue);
      final courses = service.getPurchasedCourses(student);
      expect(courses.isNotEmpty, isTrue);
    });

    test('Live classroom state is properly initialized', () {
      expect(service.isLiveClassActive, isTrue);
      expect(service.liveClassInstructor.isNotEmpty, isTrue);
      expect(service.liveClassRoomUrl.startsWith('https://meet.jit.si/'), isTrue);
    });
  });
}
