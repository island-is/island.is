# Island.is Native App

The official mobile app for [island.is](https://island.is) — Iceland's digital government services platform. Built with **Expo SDK 55** and **React Native 0.83**, this app gives citizens access to their documents, licenses, health records, finances, and more.

| | |
|-|-|
| **Platform** | iOS 15.1+ / Android SDK 23+ |
| **Framework** | Expo SDK 55 (managed workflow with prebuild) |
| **Navigation** | expo-router ~55 (file-based routing) |
| **State** | Zustand 5 |
| **Data** | Apollo Client 3 with MMKV-encrypted persistent cache |
| **Auth** | OAuth 2.0 via react-native-app-auth |
| **Styling** | styled-components 6 |
| **i18n** | react-intl 8 (Icelandic / English) |
| **Feature Flags** | ConfigCat |
| **Monitoring** | Datadog + Firebase Analytics/Perf |

## Prerequisites

- **Node.js** (see root `.nvmrc`)
- **Yarn** (monorepo uses Yarn workspaces)
- **Xcode** (iOS development, 15.1+ deployment target)
- **Android Studio** (Android development)
- **CocoaPods** (installed via `bundle install` or `gem install cocoapods`)

## Getting Started

This app lives inside the [island.is Nx monorepo](https://github.com/island-is/island.is). From the **repository root**:

```bash
# 1. Install all monorepo dependencies
yarn install

# 2. Sync native dependencies for the app
yarn nx sync-deps expo-app

# 3. Generate native projects (ios/ and android/ folders)
yarn expo prebuild --clean --cwd apps/native/app

# 4. Install CocoaPods (iOS)
cd apps/native/app/ios && pod install && cd -

# 5. Start the dev server
cd apps/native/app && yarn start
```

### Running on Device / Simulator

```bash
# iOS
cd apps/native/app
yarn ios

# Android
cd apps/native/app
yarn android
```

These commands set `APP_VARIANT=development` automatically, which configures the dev bundle ID (`is.island.app.dev`), dev icons, and development environment endpoints.

### Using Nx

You can also use Nx targets from the repo root:

```bash
yarn nx start expo-app        # Start dev server
yarn nx run-ios expo-app      # Run on iOS
yarn nx run-android expo-app  # Run on Android
yarn nx prebuild expo-app     # Generate native projects
```

> **Note:** The `ios/` and `android/` directories are **generated** via `yarn expo prebuild --clean`. Do not manually edit files in these folders — changes will be lost. All native configuration should go through `app.json`, `app.config.js`, or Expo config plugins in `plugins/`.

## Project Structure

```
apps/native/app/
├── src/
│   ├── app/                    # Expo Router screens and layouts (file-based routing)
│   ├── components/             # Shared React components
│   ├── ui/                     # Design system (40+ reusable UI primitives)
│   ├── stores/                 # Zustand state management
│   ├── graphql/                # Apollo Client setup, queries, fragments, generated types
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Core libraries (deep-linking, firebase, passkeys, etc.)
│   ├── utils/                  # Utility functions and lifecycle setup
│   ├── constants/              # Environment configs, navigation constants
│   ├── messages/               # i18n translations (Icelandic + English)
│   ├── types/                  # TypeScript type declarations
│   └── assets/                 # Icons, illustrations, fonts, logos, firebase configs
├── plugins/                    # Custom Expo config plugins
│   ├── with-island-app.js      # Android signing, adaptive icons, app name
│   └── license-widget/         # iOS WidgetKit + Android AppWidget plugin
├── .maestro/                   # E2E test flows (Maestro)
├── app.json                    # Expo static configuration
├── app.config.js               # Expo dynamic configuration (dev/prod variants)
├── metro.config.js             # Metro bundler config (Nx integration)
├── codegen.yml                 # GraphQL code generation config
├── project.json                # Nx project targets
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## App Architecture

### Entry Point and Initialization

The app boots through `src/index.ts` → `src/app/_layout.tsx`:

1. **Patch navigation** — workarounds for Expo Router edge cases
2. **Setup globals** — Datadog, Firebase, dynamic colors, LogBox config
3. **Restore auth** — reads OAuth tokens from Keychain
4. **Validate session** — checks token validity, refreshes if needed, fetches user info
5. **Initialize Apollo** — creates client with encrypted persistent cache
6. **Load fonts** — IBM Plex Sans (7 weights + italics)
7. **Hide splash screen** — once everything is ready

### Navigation (Expo Router)

The app uses **file-based routing** via Expo Router. Routes map directly to files in `src/app/`:

```
src/app/
├── _layout.tsx                     # Root: providers, auth init, splash screen
├── login.tsx                       # Login screen (OAuth flow)
├── +not-found.tsx                  # 404 fallback
├── +native-intent.tsx              # Universal link / deep link handler
└── (auth)/                         # Authenticated routes (redirects to /login if no session)
    ├── _layout.tsx                 # Auth guard, lock screen logic
    ├── app-lock.tsx                # PIN / biometric unlock
    ├── onboarding/                 # First-time setup
    │   ├── pin.tsx                 # Create PIN
    │   ├── confirm-pin.tsx         # Confirm PIN
    │   ├── biometrics.tsx          # Enable Face ID / fingerprint
    │   └── notifications.tsx       # Push notification permission
    ├── (tabs)/                     # Bottom tab navigator (5 tabs)
    │   ├── inbox/                  # Documents and notifications
    │   ├── wallet/                 # Licenses and certificates
    │   ├── index/                  # Home (default tab)
    │   ├── health/                 # Health services, medicines, vaccinations
    │   └── more/                   # Family, finance, vehicles, applications, assets
    └── (modals)/                   # Modal screens
        ├── personal-info.tsx
        ├── settings.tsx
        ├── edit-phone.tsx
        ├── edit-email.tsx
        ├── edit-bank-info.tsx
        ├── notifications/
        ├── passkey.tsx
        └── webview.tsx
```

**Adding a new screen:**

1. Create a file under the appropriate directory in `src/app/`
2. Export a default React component
3. The file path becomes the route (e.g., `src/app/(auth)/(tabs)/more/my-feature.tsx` → `/more/my-feature`)
4. For parameterized routes, use brackets: `[id].tsx`
5. For layouts/nested navigation, add a `_layout.tsx` in the directory

### State Management (Zustand)

State is managed through Zustand stores in `src/stores/`:

| Store | Purpose | Persisted |
|-------|---------|-----------|
| `auth-store` | OAuth tokens, user info, session state | Keychain |
| `preferences-store` | Locale, theme, onboarding flags, widget config | AsyncStorage |
| `environment-store` | Active environment (prod/staging/dev/local/mock) | AsyncStorage |
| `notifications-store` | FCM token, unseen badge count | No |
| `offline-store` | Network connectivity state | No |
| `ui-store` | Selected tab, modals, search queries | No |
| `organizations-store` | Cached org data and logos | No |
| `inbox-filter-store` | Inbox filtering preferences | No |
| `prompt-store` | Alert/confirm dialog state | No |
| `scan-result-store` | QR/barcode scan results | No |

MMKV encrypted storage is initialized in `src/stores/mmkv.ts` and used for the Apollo cache.

**Usage:**

```tsx
import { usePreferencesStore } from '@/stores/preferences-store'

function MyComponent() {
  const locale = usePreferencesStore((s) => s.locale)
  const setLocale = usePreferencesStore((s) => s.setLocale)
  // ...
}
```

### GraphQL / API Layer

The app communicates with the island.is API via **Apollo Client**.

- **Client setup:** `src/graphql/client.ts`
- **Link chain:** RetryLink → ErrorLink → AuthLink (Bearer token) → HttpLink
- **Cache:** `InMemoryCache` with MMKV-encrypted persistence via `apollo3-cache-persist`
- **Queries/Mutations:** `src/graphql/queries/*.graphql`
- **Fragments:** `src/graphql/fragments/*.graphql`
- **Generated types:** `src/graphql/types/schema.tsx` (auto-generated, do not edit)

**Adding a new query:**

1. Write your `.graphql` file in `src/graphql/queries/`
2. Run codegen: `yarn nx codegen/frontend-client expo-app`
3. Import the generated hook from `@/graphql/types/schema`

```tsx
import { useMyNewQuery } from '@/graphql/types/schema'

function MyScreen() {
  const { data, loading } = useMyNewQuery()
}
```

The codegen reads from the API schema at `apps/api/src/api.graphql` and generates typed React Apollo hooks.

### Authentication

OAuth 2.0 flow via `react-native-app-auth`:

- **Identity provider:** island.is national identity server (IDS)
- **Token storage:** Keychain (iOS) / Keystore (Android) via `react-native-keychain`
- **Scopes:** 25+ scopes covering documents, licenses, health, finance, vehicles, etc.
- **Redirect URL:** `is.island.app.auth://oauth` (dev: `is.island.app.dev.auth://oauth`)

The auth flow is managed in `src/stores/auth-store.ts`. Tokens are automatically refreshed when they expire, and the auth link in Apollo injects the Bearer token into every GraphQL request.

### Onboarding

After first login, users go through onboarding steps:

1. **PIN code** — required, used for app lock
2. **Biometrics** — Face ID / fingerprint (skipped if hardware unavailable)
3. **Push notifications** — permission prompt

Onboarding state is tracked in `preferences-store` and the tab layout redirects to the appropriate step if incomplete.

## Environments

The app supports 5 environments, configured in `src/constants/environments.ts`:

| Environment | API | Auth Server | Use Case |
|-------------|-----|-------------|----------|
| **prod** | `island.is/api` | `innskra.island.is` | Production |
| **staging** | `beta.staging01.devland.is/api` | `identity-server.staging01.devland.is` | Staging |
| **dev** | `beta.dev01.devland.is/api` | `identity-server.dev01.devland.is` | Development |
| **local** | `localhost:4444/api` | Uses dev IDS | Local API server |
| **mock** | `localhost:4444/api` | Uses dev IDS | Mock data |

The development build (`APP_VARIANT=development`) allows switching environments at runtime. Production builds are locked to the `prod` environment.

### App Variants

The `APP_VARIANT` environment variable controls the build variant:

| | `development` | `production` |
|-|---------------|--------------|
| **App name** | Ísland.dev | Ísland.is |
| **Bundle ID** | `is.island.app.dev` | `is.island.app` |
| **Icon** | Dev icon | Production icon |
| **Environment** | Switchable | Locked to prod |

## Styling and Theming

The app uses **styled-components** with a custom theme defined in `src/ui/utils/theme.ts`:

- **Spacing:** 8px unit system (0–30 steps)
- **Typography:** IBM Plex Sans (7 weights)
- **Colors:** Design system colors (blue, red, purple, etc.) with shade variants
- **Dark mode:** Supported via `DynamicColorIOS` and theme provider
- **Theme preference:** Light / Dark / Automatic (follows system)

The `src/ui/lib/` directory contains **40+ reusable UI primitives**: buttons, cards, inputs, badges, typography, loaders, skeleton screens, and more.

**Usage:**

```tsx
import styled from 'styled-components/native'
import { theme } from '@/ui'

const Container = styled.View`
  padding: ${theme.spacing[2]}px;
  background-color: ${theme.shade.background};
`
```

## Internationalization (i18n)

The app supports **Icelandic** (default) and **English** via `react-intl`:

- **Message files:** `src/messages/is.ts` and `src/messages/en.ts`
- **Provider:** `src/components/providers/locale-provider.tsx`
- **Locale setting:** stored in `preferences-store`

**Adding translations:**

1. Add message keys to both `src/messages/is.ts` and `src/messages/en.ts`
2. Use in components:

```tsx
import { useIntl } from 'react-intl'

function MyComponent() {
  const intl = useIntl()
  return <Text>{intl.formatMessage({ id: 'myFeature.title' })}</Text>
}
```

## Feature Flags

Feature flags are managed via **ConfigCat** with EU data governance.

- **Setup:** `src/components/providers/feature-flag-provider.tsx`
- **Client:** `src/lib/feature-flag-client.ts`
- **Polling:** Auto-poll mode with AsyncStorage cache

```tsx
import { useFeatureFlag } from '@/lib/feature-flag-client'

function MyComponent() {
  const isEnabled = useFeatureFlag('myNewFeature', false)
  if (!isEnabled) return null
  // ...
}
```

User context (national ID, app version, platform) is passed to ConfigCat for targeted rollouts.

## Deep Linking

The app handles two types of deep links:

1. **Custom scheme:** `is.island.app://` (prod) / `is.island.app.dev://` (dev)
2. **Universal links:** `https://island.is/minarsidur/*`

Route mapping is defined in `src/lib/deep-linking.ts`. Universal links from the island.is website are matched to in-app routes. If no native route exists, the link opens in an in-app browser.

Supported universal link paths include `/minarsidur/postholf` (inbox), `/minarsidur/skirteini` (wallet), `/minarsidur/heilsa` (health), and many more.

## Native Widgets

Both iOS and Android have **license widgets** that display user certificates on the home screen and lock screen.

- **Configuration plugin:** `plugins/license-widget/`
- **Data sync:** `src/lib/widget-sync.ts` pushes license data to native storage
- **iOS:** WidgetKit extension using App Groups for data sharing
- **Android:** AppWidget with `LicenseWidgetProvider`, configured via `LicenseWidgetConfigActivity`

Supported license types: Driver's License, Firearm License, Hunting License, Disability License, Machine License, ADR License.

Widget data is synced from the React Native layer to native storage (UserDefaults on iOS, SharedPreferences on Android) as a JSON payload containing the license details and photo.

## Expo Config Plugins

Native configuration that can't be expressed in `app.json` is handled via custom Expo config plugins:

| Plugin | Purpose |
|--------|---------|
| `plugins/with-island-app.js` | Android app name, adaptive icon insets, release signing config (CI + local) |
| `plugins/license-widget/` | iOS WidgetKit extension and Android AppWidget setup |

Third-party plugins are configured in `app.json` under the `plugins` array (splash screen, Firebase, vision camera, etc.).

## GraphQL Code Generation

The app uses `graphql-codegen` to generate TypeScript types and React Apollo hooks from `.graphql` files.

```bash
# From repo root
yarn nx codegen/frontend-client expo-app
```

**Config:** `codegen.yml`
- **Schema source:** `apps/api/src/api.graphql` + `src/graphql/types/client.gql`
- **Documents:** all `*.graphql` files in `src/`
- **Output:** `src/graphql/types/schema.tsx`

> Do not manually edit `src/graphql/types/schema.tsx` — it is auto-generated.

## Testing

### E2E Tests (Maestro)

The app uses [Maestro](https://maestro.mobile.dev/) for end-to-end mobile automation testing:

```bash
# Run all flows
maestro test .maestro/

# Run a specific flow
maestro test .maestro/home-flow.yaml
```

Available test flows in `.maestro/`:
- `login-screen` — authentication flow
- `home-flow` — home screen interactions
- `inbox-flow` — document inbox
- `wallet-flow` — licenses and certificates
- `health-flow` — health services
- `vehicle-flow` — vehicle information
- `finance-flow` — financial overview
- `family-flow` — family members
- `assets-flow` — real estate
- `application-flow` — applications
- `air-discount-flow` — air discount scheme

Shared utilities (sign-in, tab selection, back navigation) are in `.maestro/utils/`.

## Common Tasks

### Adding a New Screen

1. Create a file in the appropriate `src/app/` directory
2. Export a default React component
3. Add translations to `src/messages/is.ts` and `src/messages/en.ts`
4. If the screen needs data, write a `.graphql` query and run codegen

### Adding a New GraphQL Query

1. Create `src/graphql/queries/my-feature.graphql`
2. Run `yarn nx codegen/frontend-client expo-app`
3. Import the generated hook: `import { useMyQuery } from '@/graphql/types/schema'`

### Adding a New Store

1. Create `src/stores/my-store.ts`
2. Follow the Zustand pattern from existing stores
3. For persisted state, use `AsyncStorage` or `mmkv` middleware

### Adding a New Translation

1. Add the key and Icelandic text to `src/messages/is.ts`
2. Add the key and English text to `src/messages/en.ts`
3. Use: `intl.formatMessage({ id: 'myKey' })`

### Adding a Feature Flag

1. Create the flag in ConfigCat
2. Use: `const isEnabled = useFeatureFlag('flagKey', false)`

### Modifying Native Configuration

1. Update `app.json` or `app.config.js`
2. If needed, create or modify a plugin in `plugins/`
3. Regenerate native projects: `yarn expo prebuild --clean`

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | App framework and build system |
| `expo-router` | File-based navigation |
| `@apollo/client` | GraphQL client |
| `zustand` | State management |
| `styled-components` | CSS-in-JS styling |
| `react-intl` | Internationalization |
| `react-native-app-auth` | OAuth authentication |
| `react-native-keychain` | Secure token storage |
| `react-native-mmkv-storage` | Encrypted key-value storage |
| `react-native-vision-camera` | Barcode/QR scanning |
| `configcat-js` | Feature flags |
| `@react-native-firebase/*` | Analytics, push notifications, performance |
| `@datadog/mobile-react-native` | Error tracking and RUM |
| `react-native-reanimated` | Animations |
| `react-native-passkey` | Passkey authentication |

## Useful Links

- [Island.is website](https://island.is)
- [Monorepo root](https://github.com/island-is/island.is)
- [Expo documentation](https://docs.expo.dev)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [Maestro documentation](https://maestro.mobile.dev/)
