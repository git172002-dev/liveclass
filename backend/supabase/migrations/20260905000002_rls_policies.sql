-- ==============================================================================
-- Futuristic EdTech Platform (V1) - Row Level Security (RLS) Policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Functions
-- ------------------------------------------------------------------------------

-- Check if current authenticated user is an active administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE auth_user_id = auth.uid()
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Retrieve student_id associated with current auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_student_id()
RETURNS UUID AS $$
    SELECT id FROM public.students
    WHERE auth_user_id = auth.uid()
      AND status = 'active'
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 2. Enable RLS on all tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. Policies: admin_users
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Super Admins can manage admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE auth_user_id = auth.uid()
              AND role = 'super_admin'
              AND status = 'active'
        )
    );

-- ------------------------------------------------------------------------------
-- 4. Policies: students
-- ------------------------------------------------------------------------------
-- Admins have full access to manage students
CREATE POLICY "Admins full access on students"
    ON public.students FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Students can read their own profile
CREATE POLICY "Students can read own profile"
    ON public.students FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid());

-- Students can update safe profile fields (e.g., name, profile_image)
CREATE POLICY "Students can update own profile"
    ON public.students FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 5. Policies: courses
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access on courses"
    ON public.courses FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Students can view courses that they are explicitly authorized to access
CREATE POLICY "Students view authorized courses"
    ON public.courses FOR SELECT
    TO authenticated
    USING (
        status = 'published' AND
        EXISTS (
            SELECT 1 FROM public.student_course_access sca
            WHERE sca.course_id = courses.id
              AND sca.student_id = public.get_current_student_id()
              AND sca.status = 'active'
              AND NOW() BETWEEN sca.access_start AND sca.access_end
        )
    );

-- ------------------------------------------------------------------------------
-- 6. Policies: lessons
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access on lessons"
    ON public.lessons FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Students can view published lessons for authorized courses
CREATE POLICY "Students view lessons for authorized courses"
    ON public.lessons FOR SELECT
    TO authenticated
    USING (
        status = 'published' AND
        EXISTS (
            SELECT 1 FROM public.student_course_access sca
            WHERE sca.course_id = lessons.course_id
              AND sca.student_id = public.get_current_student_id()
              AND sca.status = 'active'
              AND NOW() BETWEEN sca.access_start AND sca.access_end
        )
    );

-- ------------------------------------------------------------------------------
-- 7. Policies: plans & plan_courses
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access on plans"
    ON public.plans FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users view active plans"
    ON public.plans FOR SELECT
    TO authenticated
    USING (status = 'active');

CREATE POLICY "Admins full access on plan_courses"
    ON public.plan_courses FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users view plan_courses"
    ON public.plan_courses FOR SELECT
    TO authenticated
    USING (TRUE);

-- ------------------------------------------------------------------------------
-- 8. Policies: subscriptions
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access on subscriptions"
    ON public.subscriptions FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Students view own subscriptions"
    ON public.subscriptions FOR SELECT
    TO authenticated
    USING (student_id = public.get_current_student_id());

-- ------------------------------------------------------------------------------
-- 9. Policies: student_course_access
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access on student_course_access"
    ON public.student_course_access FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Students view own course access"
    ON public.student_course_access FOR SELECT
    TO authenticated
    USING (student_id = public.get_current_student_id());

-- ------------------------------------------------------------------------------
-- 10. Policies: watch_progress
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins view all watch progress"
    ON public.watch_progress FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Students manage own watch progress"
    ON public.watch_progress FOR ALL
    TO authenticated
    USING (student_id = public.get_current_student_id())
    WITH CHECK (student_id = public.get_current_student_id());

-- ------------------------------------------------------------------------------
-- 11. Policies: analytics_events
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins view all analytics"
    ON public.analytics_events FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Authenticated users insert analytics"
    ON public.analytics_events FOR INSERT
    TO authenticated
    WITH CHECK (
        student_id IS NULL OR student_id = public.get_current_student_id()
    );
