# Roadmap

Step-by-step delivery plan. Complete one phase fully (features + tests + DoD) before starting the next.

## Progress

| Phase | Status | Summary |
|-------|--------|---------|
| 0 — Foundation | **Complete** | Scaffold, architecture, Jest, Maestro smoke, CI, docs |
| 1 — Welcome | **Complete** | Polished welcome + CTAs + login/sign-up stubs |
| 2 — Auth | Pending | Supabase login / sign-up |
| 3 — Auth gate + tabs | Pending | Session redirect + tab shell |
| 4 — Profile + notifications | Pending | Personal page + mock notifications |
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

- [ ] Create account → log out → log in on phone
- [ ] Errors shown clearly
- [ ] CI uses mocks only; `.env` documented

---

## Phase 3 — Auth gate + app shell

**Goal:** Logged-out users see public routes; logged-in users see tabs.

**Build:**

- Session listener in root layout → `(public)` vs `(app)`
- Tabs: Home | Profile | Notifications
- Log out on Profile; loading state while session resolves

**Tests:**

- RNTL: unauthenticated → welcome; authenticated → tabs; logout → welcome
- Maestro: login → tabs → logout → welcome

**Definition of done:**

- [ ] No flash of home before login
- [ ] Maestro auth flow green locally

---

## Phase 4 — Profile + simulated notifications

**Goal:** Personal page demo with fake gamification feel.

**Build:**

- Profile: avatar placeholder, display name, mock streak / XP / rank
- Notifications list (Zustand or seed data); unread badge; mark all read

**Tests:**

- Unit: Zustand store (unread count, mark read)
- RNTL: profile + notifications list + badge
- Maestro: login → profile → notifications → mark read

**Definition of done:**

- [ ] Demo-ready personal + notifications experience
- [ ] Store edge cases covered (empty list, all read)

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
| Custom native modules | Stay in Expo Go until blocked |

## How we work

1. One phase per session (or split a large phase).
2. End each phase with: phone check + green CI + DoD checklist.
3. Raise coverage thresholds only when a phase adds meaningful tests — do not block on arbitrary high % early.
