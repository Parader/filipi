# Testing

Reliability is a first-class goal. Tests ship with features, not after.

## Testing pyramid

```
        ┌─────────────┐
        │  Maestro    │  Critical flows on a development build
        │   (~10%)    │
        ├─────────────┤
        │  RNTL       │  Screen + hook tests per feature
        │   (~30%)    │
        ├─────────────┤
        │  Jest unit  │  Utils, stores, validators, mappers
        │   (~60%)    │
        └─────────────┘
```

Plus **static checks**: TypeScript (`npm run typecheck`) and ESLint (`npm run lint`).

| Layer | Tool | Purpose |
|-------|------|---------|
| Static | TypeScript + ESLint + Prettier | Catch issues before tests |
| Unit / component | Jest + `jest-expo` + RNTL | Screens, hooks, stores |
| E2E | Maestro + **Expo development build** | Critical flows on emulator/device |
| CI | GitHub Actions | Every push/PR: lint → typecheck → test |
| Later CI E2E | EAS Workflows + Maestro (Phase 7) | E2E against preview/dev builds |

## Commands

```bash
npm test              # Jest once
npm run test:watch    # Watch mode
npm run test:ci       # CI mode + coverage summary
npm run lint
npm run typecheck
npm run format:check
```

## File layout

- `__tests__/smoke.test.tsx` — Phase 0 welcome smoke test
- Colocated tests also allowed: `src/**/*.test.tsx`
- Prefer **behavior** assertions (`getByText`, `getByTestId`, roles) over snapshot tests

## Conventions (enforced from Phase 1)

1. Every button / link / interactive control: `testID` **and** accessibility label.
2. Name `testID`s consistently: `welcome-screen`, `login-submit`, `profile-logout`.
3. Mock Supabase / network in unit and component tests; never hit a real project in CI.
4. No silent error swallowing — assert error UI where relevant.
5. React Native Testing Library **v14**: `render` is **async** — always `await render(...)`.
6. HeroUI Native pulls in Reanimated; `jest.setup.js` mocks `heroui-native` for unit tests so smoke tests stay fast and stable.

## Jest setup

- Config: [`jest.config.js`](../jest.config.js) — `preset: "jest-expo"`, `setupFilesAfterEnv`
- Setup mocks: [`jest.setup.js`](../jest.setup.js)
- Coverage: collected in CI; **no global threshold** early (raise per phase as tests grow)

### Example (RNTL v14)

```tsx
import { render, screen } from "@testing-library/react-native";

test("welcome", async () => {
  await render(<WelcomeScreen />);
  expect(screen.getByTestId("welcome-screen")).toBeTruthy();
});
```

---

## Maestro E2E (development build — not Expo Go)

We **do not** drive Expo Go for E2E. Expo Go blocks reliable `launchApp`, makes custom deep links awkward, and cannot load custom native modules.

Instead Maestro launches our **development build**:

| Key | Value |
|-----|--------|
| Android package / iOS bundle id | `com.filipiboats.app` |
| URL scheme | `filipiboats` |
| How Metro is loaded | `filipiboats://expo-development-client/?url=…` |

### One-time setup

1. **JDK** — Android Studio’s JBR is enough. The Maestro wrapper sets `JAVA_HOME` automatically.
2. **Env file** (optional overrides):

```powershell
copy .env.maestro.example .env.maestro
```

3. **Install the development build** on the Android emulator (first time is slow — compiles native code):

```powershell
npm run android:device
```

This runs `expo run:android` and installs `com.filipiboats.app`.

4. **Maestro CLI** installed and on `PATH` (see [Maestro install](https://maestro.mobile.dev/getting-started/installing-maestro)).

### Every E2E run

**Terminal A — Metro (dev client mode):**

```powershell
npm run start:dev
```

**Terminal B — prep + test:**

```powershell
npm run e2e:prep
npm run test:e2e:smoke
npm run test:e2e:auth
npm run test:e2e:notifications
```

Or one flow explicitly:

```powershell
npm run maestro -- test .maestro/smoke.yaml
```

`scripts/maestro.ps1` always injects:

- `APP_ID=com.filipiboats.app`
- `DEV_CLIENT_URL=filipiboats://expo-development-client/?url=<encoded Metro URL>`

Defaults target the **Android emulator** (`METRO_HOST=10.0.2.2`, port `8081`). Override in `.env.maestro` for a physical device LAN IP.

### How open-app / smoke works

[`smoke.yaml`](../.maestro/smoke.yaml) is self-contained (no `${env}` vars — works in Maestro Studio):

1. `stopApp` + `launchApp` (**no** `clearState` — clearing state forces the Expo Dev Client launcher every run)
2. Hardcoded deep link: `filipiboats://expo-development-client/?url=http://10.0.2.2:8081`
3. If the launcher still shows **Enter URL manually**, type `http://10.0.2.2:8081` and **Connect**
4. Wait for `welcome-screen`

### Auth prerequisite

Auth / notifications flows **create a unique account each run** (`e2e+<timestamp>@filipiboats.test`). Supabase **Confirm email** must stay **OFF**.

### Flows

| Flow | What it covers |
|------|----------------|
| `smoke.yaml` | Launch → welcome |
| `welcome-flow.yaml` | Welcome → login screen |
| `auth-flow.yaml` | Sign up → sign out → log in → sign out |
| `notifications-flow.yaml` | Sign up → mark all notifications read |

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| `JAVA_HOME is not set` | Use `npm run maestro` / `npm run test:e2e:*` (not bare `maestro`) |
| App not installed | `npm run android:device` |
| Stuck on dev launcher | Ensure `npm run start:dev` is running; check `DEV_CLIENT_URL` in the wrapper output |
| `UNAVAILABLE` / ADB closed | `npm run e2e:prep` (restarts adb + reverse) and cold-boot emulator if needed |
| Wrong port | Keep Metro on **8081** (`npm run start:dev`) |

### Why not Expo Go?

- `openLink` into Expo Go fights the launcher / “Enter URL manually” UI
- Custom app deep links are hard to test inside Expo Go
- Native modules outside the Expo Go binary crash the session
- CI and partner builds need a real `appId` anyway (Phase 7)

---

## CI (GitHub Actions)

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

On every push / PR to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test:ci`

Maestro is **local only** until Phase 7 (EAS + Maestro).

## Coverage policy

- Report coverage in CI; raise thresholds only when new tests land with the feature
- Prefer meaningful critical-path coverage over chasing a high percentage

## What we do not do yet

- Detox (prefer Maestro)
- Snapshot-driven UI regression as the primary approach
- Real Supabase calls in CI
- Maestro on GitHub Actions (Phase 7)

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ROADMAP.md](./ROADMAP.md)
