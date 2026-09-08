export interface Student {
  id: string;
  name: string;
  mobile_number: string;
  email?: string;
  status: 'active' | 'inactive' | 'blocked';
  created_at: string;
  last_login?: string;
  assigned_courses_count?: number;
  active_plan_name?: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_reference: string;
  duration_seconds: number;
  sequence: number;
  status: 'published' | 'draft';
  playback_position_seconds?: number;
  is_completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  instructor: string;
  thumbnail_url: string;
  status: 'published' | 'draft' | 'archived';
  sequence: number;
  total_lessons: number;
  lessons?: Lesson[];
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  status: 'active' | 'inactive';
  course_ids: string[];
}

export interface Subscription {
  id: string;
  student_id: string;
  student_name: string;
  mobile_number: string;
  plan_name: string;
  start_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'revoked';
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Physics Class 12: Electromagnetism & Wave Optics',
    description: 'Master electromagnetic induction, alternating currents, wave nature of light, and interference with conceptual breakdowns and solved problem sets.',
    subject: 'Physics',
    instructor: 'Dr. Vikram Seth',
    thumbnail_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    sequence: 1,
    total_lessons: 4,
    lessons: [
      {
        id: 'l0000000-0000-0000-0000-000000000001',
        course_id: 'c0000000-0000-0000-0000-000000000001',
        title: '01. Introduction to Magnetic Fields & Biot-Savart Law',
        description: 'Fundamental properties of magnetic vectors, current elements, and magnetic field calculations.',
        video_reference: 'videos/physics/ch01_magnetic_fields.mp4',
        duration_seconds: 2400,
        sequence: 1,
        status: 'published',
      },
      {
        id: 'l0000000-0000-0000-0000-000000000002',
        course_id: 'c0000000-0000-0000-0000-000000000001',
        title: '02. Ampere’s Circuital Law & Solenoid Fields',
        description: 'Line integral of magnetic flux density, symmetry analysis in solenoids, and toroid calculations.',
        video_reference: 'videos/physics/ch02_amperes_law.mp4',
        duration_seconds: 2700,
        sequence: 2,
        status: 'published',
      },
      {
        id: 'l0000000-0000-0000-0000-000000000003',
        course_id: 'c0000000-0000-0000-0000-000000000001',
        title: '03. Electromagnetic Induction & Faraday’s Laws',
        description: 'Magnetic flux changes, induced EMF, Lenz law application, and eddy current damping.',
        video_reference: 'videos/physics/ch03_induction.mp4',
        duration_seconds: 3120,
        sequence: 3,
        status: 'published',
      },
      {
        id: 'l0000000-0000-0000-0000-000000000004',
        course_id: 'c0000000-0000-0000-0000-000000000001',
        title: '04. Wave Optics: Huygens Principle & Wavefronts',
        description: 'Secondary wavelets, derivation of reflection and refraction using wavefront propagation.',
        video_reference: 'videos/physics/ch04_wave_optics.mp4',
        duration_seconds: 1980,
        sequence: 4,
        status: 'published',
      }
    ]
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    title: 'Chemistry Class 12: Chemical Kinetics & Organic Synthesis',
    description: 'In-depth recorded modules covering rate equations, collision theory, reaction mechanisms, and multi-step organic synthesis paths.',
    subject: 'Chemistry',
    instructor: 'Prof. Ananya Roy',
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    sequence: 2,
    total_lessons: 2,
    lessons: [
      {
        id: 'l0000000-0000-0000-0000-000000000010',
        course_id: 'c0000000-0000-0000-0000-000000000002',
        title: '01. Rate of Reaction & Rate Law Determination',
        description: 'Instantaneous versus average reaction rates, differential rate laws, and reaction orders.',
        video_reference: 'videos/chemistry/ch01_reaction_rates.mp4',
        duration_seconds: 2100,
        sequence: 1,
        status: 'published',
      },
      {
        id: 'l0000000-0000-0000-0000-000000000011',
        course_id: 'c0000000-0000-0000-0000-000000000002',
        title: '02. Arrhenius Equation & Activation Energy Analysis',
        description: 'Temperature dependence of rate constants, Arrhenius plots, and catalytic energy profiles.',
        video_reference: 'videos/chemistry/ch02_arrhenius.mp4',
        duration_seconds: 2550,
        sequence: 2,
        status: 'published',
      }
    ]
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    title: 'Mathematics Class 12: Advanced Calculus & Differential Equations',
    description: 'Calculus masterclass covering limits, definite integrals, differential modeling, and graphical curve analysis.',
    subject: 'Mathematics',
    instructor: 'K. Ramachandran',
    thumbnail_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    sequence: 3,
    total_lessons: 1,
    lessons: [
      {
        id: 'l0000000-0000-0000-0000-000000000020',
        course_id: 'c0000000-0000-0000-0000-000000000003',
        title: '01. Limits, Continuity & Derivative Foundations',
        description: 'Epsilon-delta definitions, standard limits, and continuity on closed intervals.',
        video_reference: 'videos/math/ch01_limits.mp4',
        duration_seconds: 2800,
        sequence: 1,
        status: 'published',
      }
    ]
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's0000000-0000-0000-0000-000000000001',
    name: 'Aarav Patel',
    mobile_number: '+919876543210',
    email: 'aarav.patel@example.com',
    status: 'active',
    created_at: '2026-08-25T10:00:00Z',
    last_login: '2026-09-05T20:45:00Z',
    assigned_courses_count: 3,
    active_plan_name: 'All-Science & Math Super Bundle',
  },
  {
    id: 's0000000-0000-0000-0000-000000000002',
    name: 'Priya Sharma',
    mobile_number: '+919876543211',
    email: 'priya.sharma@example.com',
    status: 'active',
    created_at: '2026-05-15T11:30:00Z',
    last_login: '2026-08-20T14:15:00Z',
    assigned_courses_count: 1,
    active_plan_name: 'Physics Master Pass (Expired)',
  },
  {
    id: 's0000000-0000-0000-0000-000000000003',
    name: 'Rahul Varma',
    mobile_number: '+919876543212',
    email: 'rahul.varma@example.com',
    status: 'inactive',
    created_at: '2026-09-01T09:00:00Z',
    assigned_courses_count: 0,
    active_plan_name: 'None',
  },
  {
    id: 's0000000-0000-0000-0000-000000000004',
    name: 'Neha Sundaram',
    mobile_number: '+919876543213',
    email: 'neha.s@example.com',
    status: 'active',
    created_at: '2026-09-02T16:20:00Z',
    last_login: '2026-09-05T19:10:00Z',
    assigned_courses_count: 2,
    active_plan_name: 'Physics Master Pass',
  }
];

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'p0000000-0000-0000-0000-000000000001',
    name: 'Physics Master Pass',
    description: 'Complete access to Class 12 Physics recorded lectures and numerical modules for 90 days.',
    price: 1499,
    duration_days: 90,
    status: 'active',
    course_ids: ['c0000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'p0000000-0000-0000-0000-000000000002',
    name: 'All-Science & Math Super Bundle',
    description: 'Unrestricted access to Physics, Chemistry, and Mathematics recorded modules for 180 days.',
    price: 3999,
    duration_days: 180,
    status: 'active',
    course_ids: [
      'c0000000-0000-0000-0000-000000000001',
      'c0000000-0000-0000-0000-000000000002',
      'c0000000-0000-0000-0000-000000000003',
    ],
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub00000-0000-0000-0000-000000000001',
    student_id: 's0000000-0000-0000-0000-000000000001',
    student_name: 'Aarav Patel',
    mobile_number: '+919876543210',
    plan_name: 'All-Science & Math Super Bundle',
    start_date: '2026-08-25T10:00:00Z',
    expiry_date: '2027-02-21T10:00:00Z',
    status: 'active',
  },
  {
    id: 'sub00000-0000-0000-0000-000000000002',
    student_id: 's0000000-0000-0000-0000-000000000002',
    student_name: 'Priya Sharma',
    mobile_number: '+919876543211',
    plan_name: 'Physics Master Pass',
    start_date: '2026-05-15T10:00:00Z',
    expiry_date: '2026-08-13T10:00:00Z',
    status: 'expired',
  }
];
