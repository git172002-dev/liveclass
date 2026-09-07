import 'package:flutter_test/flutter_test.dart';
import 'package:aethered_student_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const AetherEdStudentApp());
    expect(find.byType(AetherEdStudentApp), findsOneWidget);
    // Flush splash Future.delayed (2000ms)
    await tester.pump(const Duration(milliseconds: 2500));
    await tester.pumpAndSettle();
  });
}
