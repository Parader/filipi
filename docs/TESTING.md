# Testing

Reliability is a first-class goal. Tests ship with features, not after.

## Testing pyramid

```
        ┌─────────────┐
        │  Maestro    │  2–4 flows (auth, profile, notifications)
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
| E2E | Maestro | Critical user flows on device/simulator |
| CI | GitHub Actions | Every push/PR: lint → typecheck → test |
| Later CI E2E | EAS Workflows + Maestro (Phase 7) | E2E against preview builds |

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
- Expo recommends Maestro for UI regression rather than Jest snapshots

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
- Peer: `test-renderer` required by `@testing-library/react-native` v14
- Coverage: collected in CI; **no global threshold in Phase 0** (raise per phase as tests grow)

### Example (RNTL v14)

```tsx
import { render, screen } from "@testing-library/react-native";

test("welcome", async () => {
  await render(<WelcomeScreen />);
  expect(screen.getByTestId("welcome-screen")).toBeTruthy();
});
```

## Maestro (local E2E)

Maestro is **documented and runnable locally** from Phase 0. It is **not** part of GitHub Actions until Phase 7.

### Install Maestro

See [Maestro docs](https://maestro.mobile.dev/getting-started/installing-maestro). On Windows, use WSL or the documented Windows install path.

### Run smoke flow

1. Start the app: `npm start`
2. Open the project in **Expo Go** on a simulator or device
3. From the repo root:

```bash
maestro test .maestro/smoke.yaml
```

### App ID notes

| Environment | `appId` in YAML |
|-------------|-----------------|
| Expo Go (Phase 0–6) | `host.exp.exponent` |
| Custom / EAS dev build (Phase 7+) | Your app id from `app.json` / EAS |

Flows live in [`.maestro/`](../.maestro/). Current:

- `smoke.yaml` — launch → welcome screen visible
- `welcome-flow.yaml` — welcome → tap Log in → login screen

## CI (GitHub Actions)

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

On every push / PR to `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test:ci`

Node 20 is required.

## Coverage policy

- Phase 0: report coverage; **no failing threshold**
- Later phases: raise thresholds only when new tests land with the feature
- Prefer meaningful critical-path coverage over chasing a high percentage

## What we do not do yet

- Detox (prefer Maestro)
- Snapshot-driven UI regression as the primary approach
- Real Supabase calls in CI
- Push-notification E2E

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ROADMAP.md](./ROADMAP.md)
