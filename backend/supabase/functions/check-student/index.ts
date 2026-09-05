// Supabase Edge Function: check-student
// Pre-validates student mobile number before permitting OTP login.
// Prevents arbitrary public registrations.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { mobile_number } = await req.json();

    if (!mobile_number || typeof mobile_number !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid mobile number is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize phone number (E.164 format)
    const cleanNumber = mobile_number.trim().replace(/\s+/g, '');

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Query students table for pre-registered active student
    const { data: student, error: dbError } = await supabaseAdmin
      .from('students')
      .select('id, name, status')
      .eq('mobile_number', cleanNumber)
      .single();

    if (dbError || !student) {
      return new Response(
        JSON.stringify({
          authorized: false,
          message: "We couldn't find an account linked to this number. Please contact your administrator.",
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (student.status !== 'active') {
      return new Response(
        JSON.stringify({
          authorized: false,
          message: 'Your student account is currently suspended. Please contact your administrator.',
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        authorized: true,
        student_id: student.id,
        name: student.name,
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
