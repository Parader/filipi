# Filipi Boats

Training app prototype with gamification — Expo + HeroUI Native + Supabase.

## Prerequisites

- **Node.js 20.19+** (Expo SDK 54 / HeroUI Native)
- **npm**
- **Android Studio** (emulator + JDK) for local runs and Maestro E2E
- Optional: Expo Go for quick UI checks only — **E2E uses a development build**

## Install

```bash
npm install
```

Copy env placeholders:

```bash
cp .env.example .env
cp .env.maestro.example .env.maestro
```

Fill `.env` from your [Supabase](https://supabase.com) project → **Project Settings → API**:
- `EXPO_PUBLIC_SUPABASE_URL` — Project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — anon public key

## Run (development build)

First install (compiles native project — slow once):

```bash
npm run android:device
```

If Gradle reports `JAVA_HOME is not set`, either reopen the terminal after `npm run setup:java`, or the `android:device` script sets Java automatically.

Then day-to-day:

```bash
npm run start:dev
```

Press `a` to open the installed `com.filipiboats.app` build, or reopen the app on the emulator.

> Expo Go still works for casual checks (`npm start` + scan QR), but Maestro E2E requires the development build.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run test:ci
```

### Maestro E2E (Android emulator)

```bash
npm run start:dev          # terminal A
npm run e2e:prep           # terminal B — adb reverse
npm run test:e2e:smoke
```

See [docs/TESTING.md](docs/TESTING.md) for the full E2E setup.

## Docs

| Doc | Purpose |
|-----|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, routing, layer responsibilities |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phases 0–7 with definition of done |
| [docs/TESTING.md](docs/TESTING.md) | Jest, RNTL, Maestro, CI conventions |

## Stack (locked)

- **Expo** (SDK 54) + TypeScript + Expo Router
- **HeroUI Native** + Uniwind (Tailwind for RN)
- **Supabase** (Auth, Postgres, RLS, Realtime) — Phase 2+
- **Zustand** (local UI state) — Phase 4+
- **TanStack Query** (server state) — Phase 5+
- **Jest** + React Native Testing Library + **Maestro**
- **GitHub Actions** CI

## Project layout

```
src/
  app/
    (public)/     # Welcome, login, sign-up
    (app)/        # Authenticated tabs (home, profile, notifications)
  components/     # Shared UI
  lib/            # Supabase client (Phase 2)
  stores/         # Zustand stores (Phase 4)
__tests__/
.maestro/
docs/
```

## License

Private prototype — all rights reserved.
