-- ==============================================================================
-- Futuristic EdTech Platform (V1) - Development Seed Data
-- ==============================================================================

-- 1. Seed Courses
INSERT INTO public.courses (id, title, description, subject, instructor, thumbnail_url, status, sequence)
VALUES 
(
    'c0000000-0000-0000-0000-000000000001',
    'Physics Class 12: Electromagnetism & Wave Optics',
    'Master electromagnetic induction, alternating currents, wave nature of light, and interference with conceptual breakdowns and solved problem sets.',
    'Physics',
    'Dr. Vikram Seth',
    'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    'published',
    1
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Chemistry Class 12: Chemical Kinetics & Organic Synthesis',
    'In-depth recorded modules covering rate equations, collision theory, reaction mechanisms, and multi-step organic synthesis paths.',
    'Chemistry',
    'Prof. Ananya Roy',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    'published',
    2
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Mathematics Class 12: Advanced Calculus & Differential Equations',
    'Calculus masterclass covering limits, definite integrals, differential modeling, and graphical curve analysis.',
    'Mathematics',
    'K. Ramachandran',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    'published',
    3
)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Lessons for Physics (Course 1)
INSERT INTO public.lessons (id, course_id, title, description, video_reference, thumbnail_url, duration_seconds, sequence, status)
VALUES
(
    'l0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    '01. Introduction to Magnetic Fields & Biot-Savart Law',
    'Fundamental properties of magnetic vectors, current elements, and magnetic field calculations.',
    'videos/physics/ch01_magnetic_fields.mp4',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80',
    2400, -- 40 mins
    1,
    'published'
),
(
    'l0000000-0000-0000-0000-000000000002',
    '02. Ampere’s Circuital Law & Solenoid Fields',
    'Line integral of magnetic flux density, symmetry analysis in solenoids, and toroid calculations.',
    'videos/physics/ch02_amperes_law.mp4',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    2700, -- 45 mins
    2,
    'published'
),
(
    'l0000000-0000-0000-0000-000000000003',
    '03. Electromagnetic Induction & Faraday’s Laws',
    'Magnetic flux changes, induced EMF, Lenz law application, and eddy current damping.',
    'videos/physics/ch03_induction.mp4',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    3120, -- 52 mins
    3,
    'published'
),
(
    'l0000000-0000-0000-0000-000000000004',
    '04. Wave Optics: Huygens Principle & Wavefronts',
    'Secondary wavelets, derivation of reflection and refraction using wavefront propagation.',
    'videos/physics/ch04_wave_optics.mp4',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    1980, -- 33 mins
    4,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Lessons for Chemistry (Course 2)
INSERT INTO public.lessons (id, course_id, title, description, video_reference, thumbnail_url, duration_seconds, sequence, status)
VALUES
(
    'l0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000002',
    '01. Rate of Reaction & Rate Law Determination',
    'Instantaneous versus average reaction rates, differential rate laws, and reaction orders.',
    'videos/chemistry/ch01_reaction_rates.mp4',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    2100,
    1,
    'published'
),
(
    'l0000000-0000-0000-0000-000000000011',
    '02. Arrhenius Equation & Activation Energy Analysis',
    'Temperature dependence of rate constants, Arrhenius plots, and catalytic energy profiles.',
    'videos/chemistry/ch02_arrhenius.mp4',
    'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=600&q=80',
    2550,
    2,
    'published'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Plans
INSERT INTO public.plans (id, name, description, price, duration_days, status)
VALUES
(
    'p0000000-0000-0000-0000-000000000001',
    'Physics Master Pass',
    'Complete access to Class 12 Physics recorded lectures and numerical modules for 90 days.',
    1499.00,
    90,
    'active'
),
(
    'p0000000-0000-0000-0000-000000000002',
    'All-Science & Math Super Bundle',
    'Unrestricted access to Physics, Chemistry, and Mathematics recorded modules for 180 days.',
    3999.00,
    180,
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Map Plans to Courses
INSERT INTO public.plan_courses (plan_id, course_id)
VALUES
('p0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001'),
('p0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'),
('p0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- 5. Seed Pre-Authorized Students (For testing mobile authentication)
INSERT INTO public.students (id, name, mobile_number, email, status, created_at)
VALUES
(
    's0000000-0000-0000-0000-000000000001',
    'Aarav Patel',
    '+919876543210',
    'aarav.patel@example.com',
    'active',
    NOW()
),
(
    's0000000-0000-0000-0000-000000000002',
    'Priya Sharma',
    '+919876543211',
    'priya.sharma@example.com',
    'active', -- Active student account, but access will be expired
    NOW() - INTERVAL '120 days'
),
(
    's0000000-0000-0000-0000-000000000003',
    'Rahul Varma',
    '+919876543212',
    'rahul.varma@example.com',
    'inactive', -- Inactive student
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Subscriptions & Access
-- Aarav Patel has Active All-Science Plan
INSERT INTO public.subscriptions (id, student_id, plan_id, start_date, expiry_date, status)
VALUES
(
    'sub00000-0000-0000-0000-000000000001',
    's0000000-0000-0000-0000-000000000001',
    'p0000000-0000-0000-0000-000000000002',
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '170 days',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Direct Course Access for Aarav (Courses 1, 2, 3)
INSERT INTO public.student_course_access (student_id, course_id, subscription_id, access_start, access_end, status)
VALUES
('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'sub00000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days', NOW() + INTERVAL '170 days', 'active'),
('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'sub00000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days', NOW() + INTERVAL '170 days', 'active'),
('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'sub00000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days', NOW() + INTERVAL '170 days', 'active')
ON CONFLICT DO NOTHING;

-- Priya Sharma has Expired Subscription (Expired 10 days ago)
INSERT INTO public.subscriptions (id, student_id, plan_id, start_date, expiry_date, status)
VALUES
(
    'sub00000-0000-0000-0000-000000000002',
    's0000000-0000-0000-0000-000000000002',
    'p0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '100 days',
    NOW() - INTERVAL '10 days',
    'expired'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.student_course_access (student_id, course_id, subscription_id, access_start, access_end, status)
VALUES
('s0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'sub00000-0000-0000-0000-000000000002', NOW() - INTERVAL '100 days', NOW() - INTERVAL '10 days', 'expired')
ON CONFLICT DO NOTHING;

-- 7. Seed Watch Progress for Aarav
INSERT INTO public.watch_progress (student_id, lesson_id, playback_position_seconds, completion_percentage, completed, last_watched_at)
VALUES
(
    's0000000-0000-0000-0000-000000000001',
    'l0000000-0000-0000-0000-000000000001',
    2300,
    95.83,
    TRUE,
    NOW() - INTERVAL '2 days'
),
(
    's0000000-0000-0000-0000-000000000001',
    'l0000000-0000-0000-0000-000000000002',
    1122, -- 18 mins 42 seconds (matching the prompt's resume example!)
    41.55,
    FALSE,
    NOW() - INTERVAL '30 minutes'
)
ON CONFLICT (student_id, lesson_id) DO NOTHING;
