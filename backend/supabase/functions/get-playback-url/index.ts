// Supabase Edge Function: get-playback-url
// Validates student access before generating a short-lived presigned video URL for Cloudflare R2.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { S3Client, GetObjectCommand } from 'https://esm.sh/@aws-sdk/client-s3@3.515.0';
import { getSignedUrl } from 'https://esm.sh/@aws-sdk/s3-request-presigner@3.515.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { lesson_id } = await req.json();
    if (!lesson_id) {
      return new Response(
        JSON.stringify({ error: 'lesson_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with user context
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired user session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Admin client for checking access tables
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Get student record by auth_user_id
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, status')
      .eq('auth_user_id', user.id)
      .single();

    if (studentError || !student || student.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Student profile not active or not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch lesson details
    const { data: lesson, error: lessonError } = await supabaseAdmin
      .from('lessons')
      .select('id, course_id, title, video_reference, duration_seconds, status')
      .eq('id', lesson_id)
      .single();

    if (lessonError || !lesson) {
      return new Response(
        JSON.stringify({ error: 'Lesson not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verify student has valid course access
    const { data: access, error: accessError } = await supabaseAdmin
      .from('student_course_access')
      .select('id, access_start, access_end, status')
      .eq('student_id', student.id)
      .eq('course_id', lesson.course_id)
      .single();

    const now = new Date().toISOString();
    if (accessError || !access || access.status !== 'active' || now < access.access_start || now > access.access_end) {
      return new Response(
        JSON.stringify({
          error: 'Your access to this course has expired. Please contact your administrator to renew.',
          access_expired: true,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Retrieve saved watch progress if any
    const { data: progress } = await supabaseAdmin
      .from('watch_progress')
      .select('playback_position_seconds')
      .eq('student_id', student.id)
      .eq('lesson_id', lesson.id)
      .maybeSingle();

    const resumePosition = progress?.playback_position_seconds ?? 0;

    // 5. Generate presigned Cloudflare R2 URL (15 minutes TTL)
    const accountId = Deno.env.get('CLOUDFLARE_R2_ACCOUNT_ID');
    const accessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const bucketName = Deno.env.get('CLOUDFLARE_R2_BUCKET_NAME') ?? 'edtech-videos';

    let playbackUrl = '';

    if (accountId && accessKeyId && secretAccessKey) {
      const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: lesson.video_reference,
      });

      playbackUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    } else {
      // Fallback for development/testing when R2 credentials are not configured yet
      playbackUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4#ref=${encodeURIComponent(lesson.video_reference)}`;
    }

    return new Response(
      JSON.stringify({
        playback_url: playbackUrl,
        resume_position_seconds: resumePosition,
        duration_seconds: lesson.duration_seconds,
        title: lesson.title,
        expires_in_seconds: 900,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
