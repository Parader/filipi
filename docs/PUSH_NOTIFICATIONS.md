# Push notifications (Expo + Supabase)

Remote push uses **Expo Push Notifications** with your **development build** (not Expo Go on Android).

## What was added

- `expo-notifications` + `expo-device` client registration
- `push_tokens` table in Supabase (RLS: users manage own tokens)
- Edge Function `send-test-push` (sends to the signed-in user's saved tokens)
- Profile screen: **Register push** + **Send test push**
- Incoming pushes append to the in-app notifications list (Zustand)

## One-time setup

### 1. Rebuild the native app (required)

The `expo-notifications` plugin needs a new native build:

```powershell
npm run android:device
```

### 2. Apply database migration

Migration file: `supabase/migrations/20260715120000_push_tokens.sql`

If not applied yet, run it via Supabase SQL editor or MCP.

### 3. Android FCM credentials (for real devices)

1. Create a Firebase project + Android app (`com.filipiboats.app`)
2. Download `google-services.json` → project root (gitignored)
3. Add to `app.json`:

```json
"android": {
  "googleServicesFile": "./google-services.json"
}
```

4. Upload FCM v1 credentials in EAS:

```powershell
npx eas credentials
```

See [Expo push setup](https://docs.expo.dev/push-notifications/push-notifications-setup/).

### 4. iOS (later)

Requires Apple Developer account + APNs key in EAS. Skip until you have a physical iPhone build.

## Try it

1. Install the **new dev build** on a **physical Android phone**
2. `npm run start:dev`
3. Sign in → **Profile** → **Register push**
4. Tap **Send test push**
5. Open **Notifications** tab — the push should appear in the list

## Notes

- **Emulator:** registration returns `simulator` — Expo push tokens need a real device with Google Play services.
- **Expo Push Tool:** https://expo.dev/notifications — paste your `ExponentPushToken[…]` for manual tests.
- **Production:** wire campaign/transactional sends through Edge Functions or a backend job using stored tokens.
