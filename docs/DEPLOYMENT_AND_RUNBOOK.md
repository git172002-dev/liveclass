# Deployment & Operations Runbook (V1)
## Futuristic EdTech Recorded Classes Platform

This runbook guides administrators and DevOps engineers through provisioning, configuring, and operating the AetherEd platform (100–150 students).

---

### 1. Supabase Database & Auth Setup

1. **Create Project**: Sign in to [Supabase](https://supabase.com) and create an organization/project.
2. **Apply Database Migrations**:
   Navigate to the SQL Editor in Supabase Studio, copy and execute in order:
   - `backend/supabase/migrations/20260905000001_initial_schema.sql` (Tables, Indexes, Constraints)
   - `backend/supabase/migrations/20260905000002_rls_policies.sql` (Row Level Security & Functions)
3. **Seed Initial Data**:
   - Execute `backend/supabase/seed.sql` to populate sample physics/chemistry/math courses, pre-authorized student phone numbers, and subscription plans.
4. **Configure Phone Auth**:
   - Under **Authentication ➔ Providers ➔ Phone**, enable Phone provider with your SMS gateway (Twilio / MessageBird) or test SMS codes for development.

---

### 2. Cloudflare R2 Video Storage Setup

1. **Create Bucket**:
   - Log into Cloudflare Dashboard ➔ R2 ➔ Create bucket named `edtech-videos-prod`.
2. **Set Bucket Access Policy**:
   - Ensure the bucket is **Private** (no public access). All videos must be streamed through short-lived presigned URLs.
3. **Configure CORS**:
   Add the following CORS policy to allow video streaming from your web dashboard and mobile app:
   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
4. **API Tokens**:
   - Create an R2 API token with `Object Read & Write` permissions. Note the `Access Key ID` and `Secret Access Key`.

---

### 3. Deploy Supabase Edge Functions

Install Supabase CLI and deploy the serverless edge functions:
```bash
# Login to Supabase
supabase login

# Deploy check-student pre-authorization function
supabase functions deploy check-student --project-ref <your-project-ref>

# Deploy get-playback-url secure streaming function
supabase functions deploy get-playback-url --project-ref <your-project-ref>

# Set Environment Secrets for Edge Functions
supabase secrets set \
  CLOUDFLARE_R2_ACCOUNT_ID="your_account_id" \
  CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key" \
  CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key" \
  CLOUDFLARE_R2_BUCKET_NAME="edtech-videos-prod"
```

---

### 4. Deploy Next.js Admin Dashboard to Vercel

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) ➔ Add New Project ➔ Import repository.
3. Set **Root Directory** to `apps/admin_dashboard`.
4. Configure Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLOUDFLARE_R2_ACCOUNT_ID`
   - `CLOUDFLARE_R2_ACCESS_KEY_ID`
   - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
5. Click **Deploy**.

---

### 5. Running the Flutter Student App

#### Prerequisites:
- Install Flutter 3.22+ ([flutter.dev](https://flutter.dev))
- Android Studio / Xcode for simulator or physical device deployment

#### Development Commands:
```bash
cd apps/student_app

# Install dependencies
flutter pub get

# Run on connected device / simulator
flutter run

# Build Android APK for testing
flutter build apk --release
```

---

### 6. Standard Student Onboarding Workflow

1. Administrator logs into Admin Dashboard (`/dashboard`).
2. Navigates to **Students ➔ Add Pre-Authorized Student**.
3. Enters student's Name and Mobile Number (e.g. `+919876543210`).
4. Navigates to **Subscriptions ➔ Grant Access to Student**.
5. Selects the student and assigns their curriculum plan (e.g. `Physics Master Pass` for 90 days).
6. Student opens the Mobile App, enters their phone number, verifies OTP, and immediately gains instant access to their authorized recorded lectures.
