# Supabase Authentication — Setup Guide

The app now supports real accounts through **Supabase Auth** (email + password), with
password reset by email. Until you add your Supabase keys, it automatically falls
back to the built-in localStorage auth, so nothing breaks in the meantime.

No backend server is required — the React app talks to Supabase directly.

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> and sign in (free tier is fine).
2. **New project** → give it a name (e.g. `billing-system`), set a database password, pick a region, create.
3. Wait ~1 minute for it to provision.

## 2. Get your API keys

In the project: **Project Settings → API**. Copy:

- **Project URL** → `https://<your-ref>.supabase.co`
- **Project API key → `anon` `public`**

## 3. Add them to the app

In the project root, copy the template and fill it in:

```bash
cp .env.example .env
```

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Restart the dev server (`npm run dev`) so Vite picks up the new env values.
That's it — the login, register and forgot-password pages now use Supabase.

## 4. Configure auth behavior (recommended)

In **Authentication → Providers → Email**, and **Authentication → URL Configuration**:

- **Confirm email**: if ON, new users must click a confirmation email before they
  can log in (the Register page tells them to check their inbox). Turn it OFF for a
  frictionless demo where accounts work immediately.
- **Site URL / Redirect URLs**: add your app's URLs so reset links return correctly:
  - `http://localhost:5173` (dev)
  - `http://localhost:5173/update-password`
  - your deployed URL + `/update-password` (once hosted)

## 5. How each flow maps to Supabase

| Page | Supabase call |
|------|---------------|
| Register | `auth.signUp` — full name & mobile saved to `user_metadata` |
| Login | `auth.signInWithPassword` |
| Forgot Password | `auth.resetPasswordForEmail` → emails a link to `/update-password` |
| Update Password (`/update-password`) | `auth.updateUser({ password })` |
| Logout | `auth.signOut` |

User identity everywhere in the app comes from `src/context/AuthContext.tsx`, which
listens to Supabase's session and exposes `{ user, loading, signOut }`.

## 6. Deploy the frontend to Vercel

This is a static Vite build (`npm run build` → `dist/`). `vercel.json` is already
included and rewrites all routes to `index.html`, so client-side routing and the
`/update-password` reset link work on refresh and deep links.

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo.
   - Framework preset: **Vite** (auto-detected). Build command `npm run build`,
     output directory `dist` — leave the defaults.
   - **Root Directory**: the repo root (where `package.json` + `vite.config.js` are).
3. **Environment Variables** (Project → Settings → Environment Variables) — add both,
   for the Production (and Preview) environments:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   > Vite inlines env vars at **build time**, so set these *before* deploying (or
   > redeploy after adding them).
4. Deploy. Copy your `https://<app>.vercel.app` URL.
5. Back in **Supabase → Authentication → URL Configuration**, add:
   - Site URL: `https://<app>.vercel.app`
   - Redirect URLs: `https://<app>.vercel.app/update-password`

> Note: this pass wires **auth only**. Module data (suppliers, invoices, products,
> purchases) still lives in each browser's `localStorage` — it is not shared across
> users or devices. Migrating those to Supabase tables is the recommended next step.
