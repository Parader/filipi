# Filipi Boats

Training app prototype with gamification — Expo + HeroUI Native + Supabase.

## Prerequisites

- **Node.js 20.19+** (Expo SDK 54 / HeroUI Native)
- **npm** (or another package manager)
- **Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

> **Important:** The App Store / Play Store Expo Go app is currently **SDK 54**. This project targets SDK 54 so scanning the QR code works. Newer SDKs (55–57) need a matching Expo Go build or a development build.

## Install

```bash
npm install
```

Copy env placeholders (used from Phase 2 onward):

```bash
cp .env.example .env
```

## Run

```bash
npm start
```

Scan the QR code with Expo Go. Edit files under `src/app/` and watch them reload.

This project targets **Expo SDK 54**, which matches the Expo Go app currently on the App Store / Play Store.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run test:ci
```

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
