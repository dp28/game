# Release and maintenance

## CI

GitHub Actions runs on pushes and pull requests:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run format
```

CI intentionally does not build store binaries yet because iOS and Android release builds need more
account-specific configuration.

## CD strategy

Start with manual release builds. Add automation only after the game is fun enough to test on real
devices.

Recommended stages:

1. **Local preview:** Expo Go and web preview.
2. **Android internal artifact:** local Android build or APK/AAB generation.
3. **iOS TestFlight:** requires Apple Developer Program membership.
4. **Store submission:** requires final icons, screenshots, privacy answers, and store copy.

## Expo commands

Development:

```bash
npm run start
```

Android preview:

```bash
npm run android
```

iOS preview:

```bash
npm run ios
```

Web preview:

```bash
npm run web
```

## Before publishing

Replace these placeholders:

- `app.json` iOS bundle identifier: `com.example.sovereignyear`
- `app.json` Android package: `com.example.sovereignyear`
- app icon and splash assets
- privacy policy URL
- support URL

## Privacy posture

The intended app should be simple to disclose:

- no accounts
- no servers
- no ads
- no third-party analytics
- no personal data collection
- local save data only

If analytics, crash reporting, ads, or cloud sync are added later, update the privacy policy and store
forms before release.

## Store listing draft

Short description:

> Guide a Renaissance border realm one year at a time in a short-burst political strategy game.

Long description:

> Balance grain, coin, legitimacy, knowledge, factions, provinces, and technology in a compact
> historical strategy game designed for quick sessions. Each turn is one year. Continue immediately
> for momentum, or step away and return with stronger deliberation. Learn real ideas from medieval,
> Renaissance, and early modern state formation through the choices you make.
