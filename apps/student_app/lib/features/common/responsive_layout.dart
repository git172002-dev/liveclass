import 'package:flutter/material.dart';

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  /// Check if the current device is a mobile phone
  static bool isPhone(BuildContext context) =>
      MediaQuery.of(context).size.width <= 600;

  /// Check if the current device is a tablet / iPad
  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width > 600;

  /// Check if tablet is in landscape orientation or wide screen
  static bool isLandscapeTablet(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return size.width > 900 && size.width > size.height;
  }

  /// Get adaptive grid columns for course plans
  static int getGridColumnCount(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width > 1100) return 3;
    if (width > 600) return 2;
    return 1;
  }

  /// Get adaptive horizontal padding for content
  static double getHorizontalPadding(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width > 900) return 32.0;
    if (width > 600) return 24.0;
    return 16.0;
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth > 1024 && desktop != null) {
          return desktop!;
        }
        if (constraints.maxWidth > 600 && tablet != null) {
          return tablet!;
        }
        return mobile;
      },
    );
  }
}
