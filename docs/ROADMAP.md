# Roadmap

Step-by-step delivery plan. Complete one phase fully (features + tests + DoD) before starting the next.

## Progress

| Phase | Status | Summary |
|-------|--------|---------|
| 0 — Foundation | **Complete** | Scaffold, architecture, Jest, Maestro smoke, CI, docs |
| 1 — Welcome | **Complete** | Polished welcome + CTAs + login/sign-up stubs |
| 2 — Auth | **Complete** | Supabase login / sign-up + profile sign-out |
| 3 — Auth gate + tabs | **Complete** | Session redirect + loading splash |
| 4 — Profile + notifications | **Complete** | Profile stats + Zustand notifications + tab badge |
| 5 — Server state | Pending | TanStack Query + profiles + RLS |
| 6 — Gamification stub | Pending | One vertical training slice |
| 7 — Distribution + CI E2E | Pending | EAS builds + Maestro in CI |

---

## Phase 0 — Foundation + quality gates

**Goal:** Runnable empty prototype with CI and docs. No product features yet.

**Build:**

- HeroUI Native + Expo Router scaffold
- Route groups `(public)` and `(app)` with placeholders
- Jest + RNTL + Maestro smoke flow
- GitHub Actions (lint → typecheck → test)
- Architecture / roadmap / testing docs
- `.env.example`

**Tests:**

- RNTL smoke: welcome screen renders with `testID="welcome-screen"`
- Maestro: app launch → welcome visible

**Definition of done:**

- [x] App structure runs with placeholder welcome
- [x] Route groups match architecture docs
- [x] `npm run lint`, `typecheck`, `test:ci` configured
- [x] GitHub Actions workflow present
- [x] Docs complete (`ARCHITECTURE`, `ROADMAP`, `TESTING`, `README`)
- [x] Maestro smoke flow written
- [x] `.env.example` present; no secrets committed

---

## Phase 1 — Welcome screen (public)

**Goal:** Polished first impression for demos.

**Build:**

- HeroUI title, subtitle, primary CTA (“Get started”), secondary (“Log in”)
- Navigation stubs to login routes
- `testID`s and accessibility labels on buttons

**Tests:**

- RNTL: welcome text + buttons render; Log in navigates (mock router)
- Maestro: open app → welcome → tap Log in

**Definition of done:**

- [x] Looks good on a real phone (verify after reload)
- [x] 3+ automated tests green
- [x] All buttons have `testID` / a11y labels

---

## Phase 2 — Supabase auth

**Goal:** Real accounts with clear error handling.

**Build:**

- Supabase project (free tier), email + password
- `src/lib/supabase.ts`, login + sign-up screens
- Validation (email format, password length)
- Session persistence via Supabase / AsyncStorage

**Tests:**

- Unit: validation helpers
- RNTL: empty submit errors; mocked successful login
- Optional manual integration against a disposable test user

**Definition of done:**

- [x] Login + sign-up forms with validation and Supabase calls
- [x] Profile sign-out for manual testing (auth gate in Phase 3)
- [x] Unit + RNTL tests; CI uses mocks only
- [ ] Create account → log out → log in on phone (verify with Supabase URL/anon key in `.env`)

---

## Phase 3 — Auth gate + app shell

**Goal:** Logged-out users see public routes; logged-in users see tabs.

**Build:**

- Session listener in root layout → `(public)` vs `(app)`
- Tabs: Home | Profile | Notifications
- Log out on Profile; loading state while session resolves

**Tests:**

- RNTL: unauthenticated → welcome; authenticated → tabs; logout → welcome
- Maestro: development build `launchApp` → sign up → tabs → logout → login → welcome

**Definition of done:**

- [x] Auth provider + session listener in root layout
- [x] Loading splash while session resolves (no tab flash)
- [x] Signed-in users redirect to Home; signed-out users redirect to Welcome
- [x] Unit + layout tests for redirect logic
- [x] Maestro `auth-flow.yaml` (self-contained sign-up; no seeded user; **dev build**)
- [ ] Verify login → tabs → logout → welcome on phone

---

## Phase 4 — Profile + simulated notifications

**Goal:** Personal page demo with fake gamification feel.

**Build:**

- Profile: avatar placeholder, display name, mock streak / XP / rank
- Notifications list (Zustand or seed data); unread badge; mark all read

**Tests:**

- Unit: Zustand store (unread count, mark read)
- RNTL: profile + notifications list + badge
- Maestro: sign up → notifications → mark read (development build)

**Definition of done:**

- [x] Profile with avatar, display name, mock streak / XP / rank
- [x] Notifications list with unread badge and mark-all-read
- [x] Zustand store tests + screen tests
- [x] Maestro `notifications-flow.yaml`
- [ ] Verify profile + notifications on phone

---

## Phase 5 — TanStack Query + Supabase profiles

**Goal:** Persist real profile data with reliable UX.

**Build:**

- TanStack Query provider
- `profiles` table + RLS (own row only)
- Loading skeletons, retries, error retry button

**Tests:**

- Unit: query keys / mappers
- RNTL: loading → success → error + retry (mocked)
- Manual: verify RLS (user A cannot read user B)

**Definition of done:**

- [ ] Edit display name persists after restart
- [ ] Offline / error UI does not crash
- [ ] RLS verified

---

## Phase 6 — Training / gamification stub

**Goal:** One vertical product slice.

**Pick one:**

- A: “Today’s challenge” card on Home
- B: Simple leaderboard + Realtime
- C: Badge toast after mock quiz

**Tests:** RNTL + unit for the slice; Maestro for the happy path.

**Definition of done:**

- [ ] One gamification loop demoable end-to-end

---

## Phase 7 — Distribution + CI E2E

**Goal:** Partner installs without your laptop; E2E on CI builds.

**Build:**

- EAS `preview` / `production` profiles
- Internal distribution (TestFlight / APK)
- EAS Workflow or GitHub Action running Maestro on preview builds

**Definition of done:**

- [ ] Partner installs via TestFlight or internal APK
- [ ] Critical Maestro flows pass on CI build

---

## Deliberately deferred

| Item | Why wait |
|------|----------|
| Push notifications (FCM/APNs) | In-app simulation is enough early |
| Detox | Maestro is simpler with Expo |
| Full leaderboard + badge system | Phase 6 stub first |
| Offline-first sync | TanStack Query cache first |
| Custom native modules | Use development builds (not Expo Go) for E2E |

## How we work

1. One phase per session (or split a large phase).
2. End each phase with: phone check + green CI + DoD checklist.
3. Raise coverage thresholds only when a phase adds meaningful tests — do not block on arbitrary high % early.
