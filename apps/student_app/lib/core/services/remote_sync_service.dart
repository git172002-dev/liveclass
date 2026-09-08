import 'dart:async';
import 'dart:convert';
import 'dart:io';
import '../models/student_models.dart';

class RemoteSyncService {
  static final RemoteSyncService _instance = RemoteSyncService._internal();
  factory RemoteSyncService() => _instance;
  RemoteSyncService._internal();

  static const String _apiEndpoint =
      'https://api.github.com/repos/git172002-dev/liveclass/contents/data/cloud_sync.json';
  static const String _rawEndpoint =
      'https://raw.githubusercontent.com/git172002-dev/liveclass/main/data/cloud_sync.json';

  bool isSyncing = false;
  bool isConnected = false;
  DateTime? lastSyncTime;
  String? lastError;

  final StreamController<bool> _syncStreamController = StreamController<bool>.broadcast();
  Stream<bool> get syncStream => _syncStreamController.stream;

  /// Fetch latest courses & syllabus from the live cloud repository
  Future<List<CourseModel>?> fetchRemoteCourses() async {
    isSyncing = true;
    _syncStreamController.add(true);

    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 8);

      // Attempt 1: GitHub Contents API (uncached live state)
      try {
        final request = await client.getUrl(Uri.parse(_apiEndpoint));
        request.headers.set('User-Agent', 'AetherEdStudentApp/1.0');
        request.headers.set('Accept', 'application/vnd.github+json');

        final response = await request.close();
        if (response.statusCode == 200) {
          final responseBody = await response.transform(utf8.decoder).join();
          final jsonMap = jsonDecode(responseBody) as Map<String, dynamic>;

          if (jsonMap.containsKey('content')) {
            final rawContent = jsonMap['content'] as String;
            final cleanBase64 = rawContent.replaceAll(RegExp(r'\s+'), '');
            final decodedJson = utf8.decode(base64Decode(cleanBase64));
            final parsedData = jsonDecode(decodedJson) as Map<String, dynamic>;

            if (parsedData.containsKey('courses')) {
              final coursesList = (parsedData['courses'] as List<dynamic>)
                  .map((c) => CourseModel.fromJson(c as Map<String, dynamic>))
                  .toList();
              isConnected = true;
              lastSyncTime = DateTime.now();
              lastError = null;
              isSyncing = false;
              _syncStreamController.add(false);
              return coursesList;
            }
          }
        }
      } catch (e) {
        // Fallback to Raw endpoint below
      }

      // Attempt 2: Direct Raw CDN fallback
      final rawRequest = await client.getUrl(Uri.parse(_rawEndpoint));
      rawRequest.headers.set('User-Agent', 'AetherEdStudentApp/1.0');
      final rawResponse = await rawRequest.close();

      if (rawResponse.statusCode == 200) {
        final rawBody = await rawResponse.transform(utf8.decoder).join();
        final parsedData = jsonDecode(rawBody) as Map<String, dynamic>;

        if (parsedData.containsKey('courses')) {
          final coursesList = (parsedData['courses'] as List<dynamic>)
              .map((c) => CourseModel.fromJson(c as Map<String, dynamic>))
              .toList();
          isConnected = true;
          lastSyncTime = DateTime.now();
          lastError = null;
          isSyncing = false;
          _syncStreamController.add(false);
          return coursesList;
        }
      }
      isConnected = false;
    } catch (e) {
      lastError = e.toString();
      isConnected = false;
    } finally {
      isSyncing = false;
      _syncStreamController.add(false);
    }
    return null;
  }
}
