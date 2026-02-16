---
Expo SDK 55 + expo-router Migration Plan

Island.is Native App (apps/native/app)

---

# Questions

- Ætlum við ennþá að styðja við Ísland.dev flavor?
- Eigum við að fara í expo-updates og setja upp OTA updates? Hver yrði kostnaðurinn. Með nýja Hermes V1 er komið bytecode diffing þannig updates verða mun minni og hraðari.
-

---

1. Screen Inventory (64 screens)

Current Navigation Architecture: react-native-navigation (Wix) v8.0.0

The app uses native navigation (not React Navigation). Every screen is independently registered via Navigation.registerComponent() and wrapped with a provider stack (ThemeProvider > I18nProvider > NavigationProvider > FeatureFlagProvider > ApolloProvider > OfflineHoc).

Bottom Tabs (5 tabs, default tab index: 2 = Home)

```
MainBottomTabs
├── Tab 0: InboxStack
│   ├── InboxScreen
│   ├── → InboxFilterScreen
│   ├── → DocumentDetailScreen
│   │   ├── → DocumentReplyScreen
│   │   └── → DocumentCommunicationsScreen
│   └── → RegisterEmailScreen
│
├── Tab 1: WalletStack
│   ├── WalletScreen
│   ├── → WalletPassScreen (/:licenseType/:passId)
│   └── → WalletPassportScreen
│
├── Tab 2: HomeStack (default)
│   ├── HomeScreen
│   └── → HomeOptionsScreen
│
├── Tab 3: ApplicationsStack
│   ├── ApplicationsScreen
│   ├── → ApplicationsCompletedScreen
│   ├── → ApplicationsInProgressScreen
│   └── → ApplicationsIncompleteScreen
│
└── Tab 4: MoreStack
    ├── MoreScreen
    ├── → VehiclesScreen → VehicleDetailScreen
    ├── → AssetsOverviewScreen
    ├── → FamilyScreen
    ├── → FinanceScreen
    ├── → AirDiscountScreen
    ├── → HealthOverviewScreen
    ├── → VaccinationsScreen
    ├── → QuestionnairesScreen → QuestionnaireDetailScreen
    ├── → MedicineDelegationScreen
    ├── → PrescriptionsScreen → MedicineHistoryScreen
    ├── → AppointmentsScreen → AppointmentDetailScreen
    └── → PersonalInfoScreen
```

Modal Screens (presented via Navigation.showModal)

|                    Route                    |             Screen             |          Notes          |
|---------------------------------------------|--------------------------------|-------------------------|
| /settings                                   | SettingsScreen                 |                         |
| /editemail                                  | EditEmailScreen                |                         |
| /editphone                                  | EditPhoneScreen                |                         |
| /editbankinfo                               | EditBankInfoScreen             |                         |
| /editconfirm/:type                          | EditConfirmScreen              |                         |
| /personalinfo                               | PersonalInfoScreen             |                         |
| /passkey                                    | PasskeyScreen                  |                         |
| /update-app                                 | UpdateAppScreen                | swipeToDismiss: false   |
| /notifications                              | NotificationsScreen            |                         |
| /webview                                    | WebViewScreen                  |                         |
| /vehicle-mileage/:id                        | VehicleMileageScreen           |                         |
| /asset/:id                                  | AssetsDetailScreen             |                         |
| /finance/status/:orgId/:chargeTypeId/:index | FinanceStatusDetailScreen      |                         |
| /family/:type/:nationalId                   | FamilyDetailScreen             |                         |
| /license-scanner                            | LicenseScannerScreen           | fullScreen presentation |
| /prescriptions/dispensation                 | MedicineHistoryDetailScreen    |                         |
| /medicine-delegation/add                    | MedicineDelegationFormScreen   |                         |
| /medicine-delegation/detail                 | MedicineDelegationDetailScreen |                         |


Auth/System Screens (not in tabs)

|            Screen             |          Context          |
|-------------------------------|---------------------------|
| LoginScreen                   | Root when unauthenticated |
| AppLockScreen                 | Overlay on app background |
| CognitoAuthScreen             | Dev environment auth      |
| OnboardingPinCodeScreen       | Post-login onboarding     |
| OnboardingBiometricsScreen    | Post-login onboarding     |
| OnboardingNotificationsScreen | Post-login onboarding     |
| DevtoolsCognitoAuthScreen     | Dev only                  |
| DevtoolsStorybookScreen       | Dev only                  |


Overlays/Navigation Components
|        Component        |         Type         |
|-------------------------|----------------------|
| OfflineBanner           | Overlay              |
| DropdownMenuOverlay     | Overlay              |
| OfflineIcon             | Navigation component |
| LicenseScanDetailScreen | Scanner result       |


---
Proposed app/ Directory Structure (expo-router)

```
app/
├── _layout.tsx                          # Root layout (providers, auth gate)
├── (auth)/
│   ├── _layout.tsx                      # Stack for auth flow
│   ├── login.tsx                        # LoginScreen
│   └── onboarding/
│       ├── pin-code.tsx                 # OnboardingPinCodeScreen
│       ├── biometrics.tsx               # OnboardingBiometricsScreen
│       └── notifications.tsx            # OnboardingNotificationsScreen
│
├── (tabs)/
│   ├── _layout.tsx                      # Bottom tab navigator (5 tabs)
│   │
│   ├── inbox/
│   │   ├── _layout.tsx                  # InboxStack
│   │   ├── index.tsx                    # InboxScreen
│   │   ├── filter.tsx                   # InboxFilterScreen
│   │   └── [docId].tsx                  # DocumentDetailScreen
│   │
│   ├── wallet/
│   │   ├── _layout.tsx                  # WalletStack
│   │   ├── index.tsx                    # WalletScreen
│   │   └── [licenseType]/
│   │       └── [passId].tsx             # WalletPassScreen
│   │
│   ├── home/
│   │   ├── _layout.tsx                  # HomeStack (default tab)
│   │   ├── index.tsx                    # HomeScreen
│   │   └── options.tsx                  # HomeOptionsScreen
│   │
│   ├── applications/
│   │   ├── _layout.tsx                  # ApplicationsStack
│   │   ├── index.tsx                    # ApplicationsScreen
│   │   ├── completed.tsx                # ApplicationsCompletedScreen
│   │   ├── in-progress.tsx              # ApplicationsInProgressScreen
│   │   └── incomplete.tsx               # ApplicationsIncompleteScreen
│   │
│   └── more/
│       ├── _layout.tsx                  # MoreStack
│       ├── index.tsx                    # MoreScreen
│       ├── vehicles/
│       │   ├── index.tsx                # VehiclesScreen
│       │   └── [id].tsx                 # VehicleDetailScreen
│       ├── assets.tsx                   # AssetsOverviewScreen
│       ├── family.tsx                   # FamilyScreen
│       ├── finance.tsx                  # FinanceScreen
│       ├── air-discount.tsx             # AirDiscountScreen
│       ├── health/
│       │   ├── index.tsx                # HealthOverviewScreen
│       │   ├── vaccinations.tsx         # VaccinationsScreen
│       │   ├── questionnaires/
│       │   │   ├── index.tsx            # QuestionnairesScreen
│       │   │   └── [id].tsx             # QuestionnaireDetailScreen
│       │   └── appointments/
│       │       ├── index.tsx            # AppointmentsScreen
│       │       └── [id].tsx             # AppointmentDetailScreen
│       ├── medicine/
│       │   ├── prescriptions.tsx        # PrescriptionsScreen
│       │   ├── history.tsx              # MedicineHistoryScreen
│       │   └── delegation/
│       │       └── index.tsx            # MedicineDelegationScreen
│       └── personal-info.tsx            # PersonalInfoScreen
│
├── (modals)/
│   ├── _layout.tsx                      # Modal group (presentation: 'modal')
│   ├── settings.tsx                     # SettingsScreen
│   ├── notifications.tsx                # NotificationsScreen
│   ├── passkey.tsx                       # PasskeyScreen
│   ├── update-app.tsx                   # UpdateAppScreen (gestureEnabled: false)
│   ├── webview.tsx                      # WebViewScreen
│   ├── edit-email.tsx                   # EditEmailScreen
│   ├── edit-phone.tsx                   # EditPhoneScreen
│   ├── edit-bank-info.tsx               # EditBankInfoScreen
│   ├── edit-confirm/[type].tsx          # EditConfirmScreen
│   ├── vehicle-mileage/[id].tsx         # VehicleMileageScreen
│   ├── asset/[id].tsx                   # AssetsDetailScreen
│   ├── finance-status/
│   │   └── [orgId]/[chargeTypeId]/[index].tsx  # FinanceStatusDetailScreen
│   ├── family/[type]/[nationalId].tsx   # FamilyDetailScreen
│   ├── license-scanner.tsx              # LicenseScannerScreen (fullScreenModal)
│   ├── medicine-dispensation.tsx         # MedicineHistoryDetailScreen
│   ├── medicine-delegation-form.tsx     # MedicineDelegationFormScreen
│   ├── medicine-delegation-detail.tsx   # MedicineDelegationDetailScreen
│   ├── document-reply.tsx               # DocumentReplyScreen
│   └── document-communications.tsx      # DocumentCommunicationsScreen
│
├── app-lock.tsx                         # AppLockScreen (special overlay)
└── +not-found.tsx                       # 404 handler
```

---

2. Navigation Patterns

Deep Linking

Currently implemented via a custom system in src/lib/deep-linking.ts:
- Scheme: is.island.app:// (+ .dev, .staging variants)
- Universal Links: Maps /minarsidur/* URLs to app routes (17 mappings in urlMapping)
- Routes registered imperatively via addRoute(pattern, callback)

Migration: expo-router handles deep linking automatically from file structure. The urlMapping for universal links moves to app.config.ts intentFilters/associatedDomains.

Auth Flow

App Launch → readAuthorizeResult() from Keychain
  → checkIsAuthenticated() (validates token, fetches userInfo)
    → NOT authenticated → LoginScreen
    → Authenticated + needs onboarding → Login + Onboarding stack
    → Authenticated → MainBottomTabs

Migration: Root _layout.tsx will use a redirect pattern:
// app/_layout.tsx
const { isAuthenticated, isLoading } = useAuthStore()
if (isLoading) return <SplashScreen />
if (!isAuthenticated) return <Redirect href="/login" />

Modal Presentations

18 screens presented as modals. In expo-router, this maps to a (modals) route group with presentation: 'modal' in the layout.

Tab Bar

5 tabs: Inbox (0), Wallet (1), Home (2, default), Applications (3), More (4). Custom icons per tab. Badge on notifications. Default tab is Home (index 2).

Header Customizations

All screens use createNavigationOptionHooks which provides a getNavigationOptions function. This sets:
- Top bar title (localized)
- Right buttons (notifications bell, settings gear, scan, options)
- Back button visibility
- Large title mode

---
3. Native Dependencies Audit

Must Replace (Expo equivalents exist)
|                 Current                  |           Replace With           |                Effort                |
|------------------------------------------|----------------------------------|--------------------------------------|
| react-native-navigation 8.0.0 (patched)  | expo-router (React Navigation)   | Very High - core architecture change |
| react-native-navigation-hooks 6.3.0      | expo-router hooks                | High                                 |
| react-native-device-info 10.3.0          | expo-device + expo-constants     | Low                                  |
| react-native-inappbrowser-reborn 3.7.0   | expo-web-browser                 | Low                                  |
| react-native-share 12.1.0                | expo-sharing                     | Low                                  |
| react-native-blob-util 0.19.9            | expo-file-system (already using) | Medium                               |
| @react-native-clipboard/clipboard 1.11.2 | expo-clipboard                   | Low                                  |


Keep (compatible with Expo dev client)
|                  Package                  |     Version     |                    Notes                    |
|-------------------------------------------|-----------------|---------------------------------------------|
| react-native-reanimated                   | 3.18.0          | Expo-compatible, already using babel plugin |
| react-native-gesture-handler              | 2.22.0          | Required by React Navigation                |
| react-native-svg                          | 15.12.1         | Expo-compatible                             |
| react-native-webview                      | 13.13.1         | Expo-compatible                             |
| @react-native-async-storage/async-storage | 2.2.0           | Expo-compatible                             |
| @react-native-firebase/*                  | 22.4.0          | Works with dev client                       |
| @datadog/mobile-react-native              | 1.3.0           | Works with dev client                       |
| react-native-app-auth                     | 8.0.3           | Works with dev client                       |
| react-native-keychain                     | 8.1.1           | Works with dev client                       |
| react-native-vision-camera                | 4.7.1           | Works with dev client                       |
| react-native-mmkv-storage                 | 0.11.2          | Works with dev client                       |
| react-native-passkey                      | 2.1.1 (patched) | Works with dev client                       |
| react-native-date-picker                  | 5.0.4           | Works with dev client                       |
| @react-native-community/netinfo           | 11.3.1          | Works with dev client                       |
| @react-native-cookies/cookies             | 6.2.1           | Works with dev client                       |
| react-native-quick-base64                 | 2.2.1           | Works with dev client                       |
| react-native-markdown-display             | 7.0.2           | JS-only                                     |
| react-native-passkit-wallet               | 0.1.6           | Works with dev client                       |
| react-native-widgetkit                    | 1.0.9           | Works with dev client                       |
| react-native-spotlight-search             | 2.2.0           | Works with dev client                       |
| react-native-quick-actions                | 0.3.13          | Works with dev client                       |
| react-native-keyboard-manager             | 6.5.4-3         | Works with dev client                       |


Deprecated / Should Replace

|                      Package                       |          Issue          |               Replacement               |
|----------------------------------------------------|-------------------------|-----------------------------------------|
| react-native-interactable 2.0.1                    | Unmaintained since 2018 | Reanimated gesture-based interactions   |
| react-native-pdf 6.7.7 (patched)                   | Poorly maintained       | react-native-pdf-light or WebView-based |
| react-native-dialogs 1.1.2                         | Unmaintained since 2018 | React Native Alert API                  |
| @react-native-community/progress-bar-android 1.0.5 | Deprecated              | Custom component with Reanimated        |
| @react-native-community/progress-view 1.3.1        | Low maintenance         | Custom component                        |
| zustand 3.5.12                                     | Very old (v3)           | Upgrade to zustand v5                   |


Patched Packages (risk during upgrade)

|            Package            |                   Patch Purpose                    |
|-------------------------------|----------------------------------------------------|
| react-native 0.77.3           | Custom RN modifications                            |
| react-native-navigation 8.0.0 | Removed entirely in migration                      |
| react-native-passkey 2.1.1    | WebAuthn customization - verify patch still needed |
| react-native-pdf 6.7.7        | PDF rendering fixes - replace package entirely     |


---
4. State & Data

State Management: Zustand v3 (7 stores)
|       Store        |           Persistence            |          Key          |
|--------------------|----------------------------------|-----------------------|
| authStore          | Keychain (react-native-keychain) | @islandis_{bundleId}  |
| preferencesStore   | AsyncStorage (zustand persist)   | preferences_04        |
| notificationsStore | AsyncStorage (zustand persist)   | notifications_07      |
| environmentStore   | AsyncStorage (zustand persist)   | @island/environment13 |
| organizationsStore | AsyncStorage (zustand persist)   | organizations_02      |
| uiStore            | In-memory only                   | N/A                   |
| offlineStore       | In-memory only                   | N/A                   |


Data Fetching: Apollo Client 3.7.7

- GraphQL with auto-generated hooks from codegen.yml
- Persistent encrypted cache via MMKV + apollo3-cache-persist
- Link chain: connectivity → retry → error → auth (token refresh) → http
- Default policy: cache-and-network

Navigation ↔ State Interactions

These patterns must be preserved during migration:

1. Auth state drives root layout - getAppRoot() chooses login vs tabs based on checkIsAuthenticated()
2. Tab selection stored in uiStore - selectedTab/unselectedTab tracked via navigation events
3. Notification badge - notificationsStore.unseenCount updates tab bar badge via Navigation.mergeOptions()
4. Theme changes - preferencesStore.appearanceMode updates navigation defaults
5. Offline state - offlineStore.isConnected toggles offline banner overlay

---
5. Platform-Specific Code

No .ios.ts / .android.ts files

All platform logic uses conditional checks centralized in src/utils/devices.ts:
export const isIos = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'

Custom Native Modules (must port to Expo Modules API or keep as-is)

iOS - RNIsland.mm:
- overrideUserInterfaceStyle() - dark/light mode
- openSafari() - SFSafariViewController (replace with expo-web-browser)
- setPreferencesValue() - UserDefaults for widget communication

Android - IslandModule.java:
- getAppVersion() - installed app version
- canAddPasses() / addPass() - wallet pass integration

Both Platforms - LicenseWidgetModule:
- iOS: WidgetKit (Swift) with AppIntentConfiguration
- Android: AppWidgetProvider (Java) with SharedPreferences

Platform.select Usage: ~32 files

Concentrated in browser handling, widget sync, biometrics labels, notification permissions.

---
6. Assets & Config

|    Item     |                         Current                         |          Expo SDK 55 Target          |
|-------------|---------------------------------------------------------|--------------------------------------|
| Babel       | .babelrc.js with babel-preset-expo + reanimated         | Keep, already Expo-compatible        |
| Metro       | metro.config.js with SVG transformer + Nx               | Migrate to expo/metro-config base    |
| Icons       | Manual xcassets + mipmap density folders                | app.config.ts icon field + EAS Build |
| Splash      | iOS Storyboard + Android XML drawable                   | expo-splash-screen config            |
| Fonts       | react-native.config.js asset linking                    | expo-font or useFonts hook           |
| Environment | Hardcoded in src/config.ts per env ID                   | Keep (no .env files used)            |
| Firebase    | Per-env GoogleService-Info plist / google-services.json | Keep with expo-build-properties      |
| Build       | NX targets + manual Xcode/Gradle                        | EAS Build + eas.json                 |
| Variants    | iOS schemes + Android flavors (dev/prod)                | EAS Build profiles                   |


---
7. Migration Phases

Phase 0: Preparation (no breaking changes)

- Upgrade zustand 3.5.12 → 5.x (update store patterns)
- Replace react-native-pdf with @kishannareshpal/expo-pdf
- Replace react-native-dialogs with RN Alert
-- We have showPicker in 2 places (change language and select Gjaldgrunnur)
-- We have showAndroidPrompt in 1 place, for mileage input edit modal.
- Replace react-native-inappbrowser-reborn → expo-web-browser
- Replace react-native-share → expo-sharing
- Replace react-native-device-info → expo-device + expo-constants
- Replace @react-native-clipboard/clipboard → expo-clipboard
- Remove deprecated progress bar/view packages

Phase 1: Expo SDK 55 Setup

- Create app.config.ts with full Expo config (icons, splash, plugins)
- Set up eas.json with build profiles (dev, staging, prod)
- Migrate metro.config.js to use expo/metro-config
- Configure expo-splash-screen to replace storyboard/XML splash
- Configure expo-font for IBM Plex Sans
- Set up expo-build-properties for Firebase and native module settings
- Verify all kept native packages work with Expo dev client (npx expo prebuild)

Phase 2: Navigation Migration (highest risk)

- Install expo-router v4, @react-navigation/native, @react-navigation/bottom-tabs
- Create the app/ directory structure per the proposed layout above
- Migrate screens incrementally by tab:
  a. HomeStack (simplest - 2 screens)
  b. ApplicationsStack (4 screens, no modals)
  c. InboxStack (4 screens, complex document detail)
  d. WalletStack (3 screens, license scanner modal)
  e. MoreStack (15+ screens, deepest nesting)
- Migrate modal screens to (modals) group
- Port auth flow to root _layout.tsx redirect pattern
- Port deep linking to expo-router's file-based scheme
- Port universal link mapping to app.config.ts

Phase 3: Provider & State Integration

- Replace registerComponent() wrapper with a single root _layout.tsx provider tree
- Replace react-native-navigation-hooks (useNavigationButtonPress, useNavigationComponentDidAppear) with React Navigation equivalents (useNavigation, useFocusEffect)
- Port createNavigationOptionHooks to expo-router <Stack.Screen options={}> pattern
- Port uiStore tab tracking to React Navigation tab events
- Port notification badge to expo-router tab bar badge
- Port app lock overlay to expo-router modal or root-level component

Phase 4: Native Module Migration

- Remove RNIsland.mm
- Remove IslandModule.java
- Keep widget implementations as-is (iOS WidgetKit + Android AppWidget are independent of navigation)
- Update AppDelegate.swift from RNNAppDelegate to Expo's ExpoAppDelegate
- Update MainApplication.java from NavigationApplication to standard RN + Expo

Phase 5: Cleanup & Testing

- Remove react-native-navigation and its patches
- Remove react-native-navigation-hooks
- Remove src/utils/component-registry.ts (replaced by file-based routing)
- Remove src/lib/deep-linking.ts (replaced by expo-router)
- Remove src/utils/lifecycle/setup-routes.ts
- Remove src/utils/register-component.tsx
- Verify all deep links work
- Verify all universal links work
- Verify widget ↔ app communication still works
- E2E test all navigation flows

---
8. Risk Areas & Potential Blockers

Critical Risks
|                    Risk                    |                                                       Impact                                                        |                                 Mitigation                                  |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| react-native-navigation → React Navigation | Every screen's navigation API changes (Navigation.push → router.push, passProps → route params, componentId → gone) | Migrate one tab at a time; can't run both navigation systems simultaneously |
| Patched react-native-passkey               | Custom WebAuthn modifications may conflict with Expo prebuild                                                       | Test patch compatibility early; consider upstreaming changes                |
| Apollo cache persistence (MMKV)            | react-native-mmkv-storage 0.11.2 is old; may have issues with newer RN                                              | Test with react-native-mmkv (newer fork) or expo-sqlite for cache           |
| AppDelegate/MainApplication rewrites       | Must remove RNN base classes, add Expo delegates                                                                    | Firebase, AppAuth, Spotlight, QuickActions all hook into AppDelegate        |
| Custom navigation option hooks             | createNavigationOptionHooks deeply integrated in every screen                                                       | Replace with React Navigation screenOptions pattern in layout files         |



Medium Risks

|            Risk            |                  Impact                  |                              Mitigation                              |
|----------------------------|------------------------------------------|----------------------------------------------------------------------|
| Tab-based navigation state | uiStore.selectedTab driven by RNN events | React Navigation emits different events; test badge/tab sync         |
| Modal stacking patterns    | RNN supports arbitrary modal stacking    | expo-router modals are more constrained; may need layout adjustments |
| Cognito auth browser flow  | RNIsland.openSafari used for Cognito     | Replace with expo-web-browser openAuthSessionAsync                   |
| Monorepo Metro resolution  | Nx + custom nodeModulesPaths             | expo-router's metro config needs watchFolders for monorepo           |
| Build variants (dev/prod)  | Android flavors + iOS schemes            | Map to EAS Build profiles in eas.json                                |


Low Risks
|           Risk            |                    Notes                    |
|---------------------------|---------------------------------------------|
| Fonts                     | expo-font handles IBM Plex Sans TTFs easily |
| Icons/Splash              | expo-image handles icon generation          |
| GraphQL codegen           | Unaffected by navigation changes            |
| Feature flags (ConfigCat) | Unaffected                                  |
| Firebase                  | Works with dev client, well-documented      |


---
9. Packages Summary

Remove

- react-native-navigation (8.0.0)
- react-native-navigation-hooks (6.3.0)
- react-native-interactable (2.0.1)
- react-native-dialogs (1.1.2)
- react-native-inappbrowser-reborn (3.7.0)
- react-native-device-info (10.3.0)
- react-native-share (12.1.0)
- @react-native-clipboard/clipboard (1.11.2)
- @react-native-community/progress-bar-android (1.0.5)
- @react-native-community/progress-view (1.3.1)
- react-native-pdf (6.7.7)

Add

- expo-router (v4)
- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/native-stack
- expo-web-browser
- expo-sharing
- expo-device
- expo-constants
- expo-clipboard
- expo-splash-screen
- expo-font
- expo-build-properties

Upgrade

- zustand 3.5.12 → 5.x
- expo 52.0.47 → 55.x
- react-native 0.77.3 → version required by SDK 55
- react-native-reanimated → version compatible with SDK 55
- react-native-gesture-handler → version compatible with SDK 55
- All expo-* packages → SDK 55 compatible versions

Keep As-Is

All Firebase, Datadog, Keychain, MMKV, VisionCamera, Passkey, PassKit, WidgetKit, SpotlightSearch, QuickActions, AppAuth, NetInfo, Cookies, WebView, SVG packages - these all work with Expo dev client.
