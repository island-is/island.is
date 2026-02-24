# Todo list

- [x] Offline toasts migration from RNN.

---

## Migration TODOs

All `@todo migration` comments found in the codebase, grouped by file.

### ~~`src/lib/deep-linking.ts`~~ ✅
- ~~`evaluateUrl()`: Deprecated no-op — expo-router handles URL routing.~~
- ~~`addRoute()` / `addScheme()`: Removed — no longer needed with expo-router.~~
- ~~`navigateTo()`: Throttle / duplicate-navigation protection restored.~~
- ~~`navigateToUniversalLink()`: `findRoute()` implemented with `urlMapping`; falls back to `openBrowser`.~~

### ~~`src/utils/lifecycle/setup-event-handlers.ts`~~ ✅
- ~~Bottom-tab selected listener: Removed — expo-router handles tab state automatically.~~
- ~~App-lock `AppState` listener: Removed — lives in `(auth)/_layout.tsx`, now respects `suppressLockScreen()`.~~
- ~~Navigation button press listener: Removed — expo-router handles navigation buttons via screen options.~~

### `src/lib/passkeys/useAuthenticatePasskey.ts`
- **Line 47** — `authenticatePasskey()`: Verify that the native `btoa` global works correctly; the old `react-native-quick-base64` import was removed. Also confirm the result shape matches what the server expects.

### `src/lib/passkeys/helpers.ts`
- **Line 71** — `formatAuthenticationOptions()`: Mapping to the WebAuthn spec is incomplete; needs a proper field-by-field mapping.
- **Line 82** — `formatRegisterOptions()`: Same as above for the registration flow.

### `src/hooks/use-deep-link-handling.ts`
- **Line 37** — `useDeepLinkHandling()`: Verify this hook works end-to-end with expo-router's `useURL()` and Firebase notification handling. (Now uses the updated `navigateToUniversalLink` with `findRoute`).

### ~~`src/hooks/use-connectivity-indicator.ts`~~ ✅
- ~~Deleted — had zero callers; RNN topBar button management replaced by `OfflineIcon` component rendered directly in `NavigationBarSheet`.~~

### `src/components/dropdown/dropdown-menu-overlay.tsx`
- **Line 58** — `DropdownMenuOverlay`: Still uses `router.dismiss()` as a placeholder; the full overlay registration / dismiss cycle from RNN is not yet re-implemented.

### ~~`src/components/offline/offline-icon.tsx`~~ ✅
- ~~`OfflineIcon`: `onPress` now toggles banner visibility via `offlineStore.toggleBanner()`.~~

### ~~`src/components/providers/offline-provider.tsx`~~ ✅
- ~~`OfflineProvider`: Renders `OfflineBanner` directly as an absolutely positioned overlay; mounted in root `_layout.tsx`.~~

### `src/components/providers/theme-provider.tsx`
- **Line 48** — `ThemeProvider`: `Appearance.setColorScheme` block is commented out. Determine whether dynamic theme switching will be supported; if not, remove this block entirely.

### `src/stores/notifications-store.ts`
- **Line 111** — `updateNavigationUnseenCount()`: `Navigation.mergeOptions` call to update the topBar notification-badge button is commented out; needs expo-router equivalent.

### `src/stores/preferences-store.ts`
- **Line 122** — `onRehydrateStorage` callback: `Navigation.setDefaultOptions(getDefaultOptions(...))` call is commented out; determine whether default navigation options need to be re-applied after store hydration in expo-router.

### ~~`src/app/+native-intent.tsx`~~ ✅
- ~~`redirectSystemPath()`: Now uses `findRoute()` from deep-linking to map universal link paths to native routes.~~

### `src/app/(auth)/(tabs)/_layout.tsx`
- **Line 107** — Android tabbar overdraw: A decorative view meant to draw over the tabbar on Android is commented out; needs investigation for expo-router's tab layout.

### `src/app/(auth)/(tabs)/wallet/[licenseType]/[id].tsx`
- **Line 116** — `AddPassButton`: Stub component; needs to integrate with the native Wallet/PassKit API.
- **Line 338** — Wallet pass download: The `pkpass` download and add-to-wallet flow after `generatePkPass` is incomplete.

### `src/utils/lifecycle/setup-globals.ts`
- **Line 77** — Datadog RUM configuration: The `DatadogProviderConfiguration` block is present but `TrackingConsent.NOT_GRANTED` is set by default; confirm consent flow and enable RUM for production.


## Routes

# New structure                                              # Old screen source

  app/
  ├── [x] _layout.tsx                                          # Root layout
  ├── [x] login.tsx                                            # /screens/login/login.tsx (LoginScreen)
  ├── [x] +native-intent.tsx                                   # Deep linking intent handler
  ├── [x] +not-found.tsx                                       # 404 fallback
  │
  ├── (auth)/
  │   ├── [x] _layout.tsx                                      # Auth guard layout
  │   ├── [x] app-lock.tsx                                     # /screens/app-lock/app-lock.tsx (AppLockScreen)
  │   │
  │   ├── onboarding/
  │   │   ├── [x] _layout.tsx                                  # Onboarding stack layout
  │   │   ├── [x] pin.tsx                                      # /screens/onboarding/onboarding-pin-code.tsx (OnboardingPinCodeScreen)
  │   │   ├── [x] confirm-pin.tsx                              # New screen (confirm PIN)
  │   │   ├── [x] biometrics.tsx                               # /screens/onboarding/onboarding-biometrics.tsx (OnboardingBiometricsScreen)
  │   │   └── [x] notifications.tsx                            # /screens/onboarding/onboarding-notifications.tsx (OnboardingNotificationsScreen)
  │   │
  │   ├── (modals)/                                            # (Modals that needs to be accessible from anywhere in the app)
  │   │   ├── [x] settings.tsx                                 # /screens/settings/settings.tsx (SettingsScreen)
  │   │   ├── [x] edit-phone.tsx                               # /screens/settings/edit-phone.tsx (EditPhoneScreen)
  │   │   ├── [x] edit-confirm.tsx                             # /screens/settings/edit-confirm.tsx (EditConfirmScreen)
  │   │   ├── [x] edit-email.tsx                               # /screens/settings/edit-email.tsx (EditEmailScreen)
  │   │   ├── [x] edit-bank-info.tsx                           # /screens/settings/edit-bank-info.tsx (EditBankInfoScreen)
  │   │   ├── [x] personal-info.tsx                            # /screens/more/personal-info.tsx (PersonalInfoScreen)
  │   │   ├── [x] passkey.tsx                                  # /screens/passkey/passkey.tsx (PasskeyScreen)
  │   │   ├── [x] update-app.tsx                               # /screens/update-app/update-app.tsx (UpdateAppScreen)
  │   │   ├── [x] notifications.tsx                            # /screens/notifications/notifications.tsx (NotificationsScreen)
  │   │   └── [x] webview.tsx                                  # /screens/webview/webview.tsx (WebViewScreen)
  │   │
  │   └── (tabs)/                                              # 5 tabs: inbox | wallet | home | health | more
  │       ├── [x] _layout.tsx                                  # Tab bar layout (NativeTabs)
  │       │
  │       ├── [x] index.tsx                                    # /screens/home/home.tsx (HomeScreen)
  │       ├── [x] options.tsx                                  # /screens/home/home-options.tsx (HomeOptionsScreen)
  │       │
  │       ├── inbox/
  │       │   ├── [x] _layout.tsx                              # Inbox stack layout
  │       │   ├── [x] index.tsx                                # /screens/inbox/inbox.tsx (InboxScreen)
  │       │   ├── [x] [id].tsx                                 # /screens/document-detail/document-detail.tsx (DocumentDetailScreen)
  │       │   ├── [x] filter.tsx                               # /screens/inbox/inbox-filter.tsx (InboxFilterScreen)
  │       │   ├── [x] [id]/communications.tsx                  # /screens/document-detail/document-communications.tsx (DocumentCommunicationsScreen)
  │       │   └── [x] [id]/reply.tsx                           # /screens/document-detail/document-reply.tsx (DocumentReplyScreen)
  │       │
  │       ├── wallet/
  │       │   ├── [x] _layout.tsx                              # Wallet stack layout
  │       │   ├── [x] index.tsx                                # /screens/wallet/wallet.tsx (WalletScreen)
  │       │   ├── scanner/ (modal stack)
  │       │   │   ├── [x] index.tsx                            # /screens/license-scanner/license-scanner.tsx (LicenseScannerScreen)
  │       │   │   └── [x] [id].tsx                             # /screens/license-scanner/license-scan-detail.tsx (LicenseScanDetailScreen)
  │       │   └── [licenseType]/
  │       │       └── [x] [id].tsx                             # /screens/wallet-pass/wallet-pass.tsx (WalletPassScreen)
  │       │
  │       ├── health/
  │       │   ├── [x] _layout.tsx                              # Health stack layout
  │       │   ├── [x] index.tsx                                # /screens/health/health-overview.tsx (HealthOverviewScreen)
  │       │   ├── [x] categories.tsx                           # /screens/health/health-categories.tsx (new)
  │       │   ├── medicine/
  │       │   │   ├── prescriptions/ (modal stack)
  │       │   │   │   ├── [x] index.tsx                        # /screens/medicine/prescriptions.tsx (PrescriptionsScreen)
  │       │   │   │   └── [x] history.tsx                      # /screens/medicine/components/medicine-history.tsx (MedicineHistoryScreen)
  │       │   │   ├── delegation/ (modal stack)
  │       │   │   │   ├── [x] index.tsx                        # /screens/medicine-delegation/medicine-delegation-content.tsx (MedicineDelegationScreen)
  │       │   │   │   ├── [x] add.tsx                          # /screens/medicine-delegation/medicine-delegation-form.tsx (MedicineDelegationFormScreen)
  │       │   │   │   └── [x] [id].tsx                         # /screens/medicine-delegation/medicine-delegation-detail.tsx (MedicineDelegationDetailScreen)
  │       │   ├── [x] vaccinations.tsx                         # /screens/vaccinations/vaccinations.tsx (VaccinationsScreen)
  │       │   ├── [x] appointments.tsx                         # /screens/appointments/appointments.tsx (AppointmentsScreen)
  │       │   ├── [x] appointment/[id].tsx                     # /screens/appointments/appointment-detail.tsx (AppointmentDetailScreen)
  │       │   └── questionnaires/
  │       │       ├── [x] index.tsx                            # /screens/health/questionnaires/questionnaires.tsx (QuestionnairesScreen)
  │       │       └── [x] [id].tsx                             # /screens/health/questionnaires/questionnaire-detail.tsx (QuestionnaireDetailScreen)
  │       │
  │       └── more/
  │           ├── [x] _layout.tsx                              # More stack layout
  │           ├── [x] index.tsx                                # /screens/more/more.tsx (MoreScreen)
  │           ├── [x] air-discount.tsx                         # /screens/air-discount/air-discount.tsx (AirDiscountScreen)
  │           ├── family/
  │           │   ├── [x] _layout.tsx                          # Family stack layout
  │           │   ├── [type]/
  │           │   │   └── [x] [nationalId].tsx (modal)         # /screens/family/family-details.tsx (FamilyDetailScreen)
  │           │   └── [x] index.tsx                            # /screens/family/family-overview.tsx (FamilyScreen)
  │           ├── assets/
  │           │   ├── [x] [id].tsx (modal)                     # /screens/assets/assets-detail.tsx (AssetsDetailScreen)
  │           │   └── [x] index.tsx                            # /screens/assets/assets-overview.tsx (AssetsOverviewScreen)
  │           ├── vehicles/
  │           │   ├── [x] index.tsx                            # /screens/vehicles/vehicles.tsx (VehiclesScreen)
  │           │   ├── mileage/
  │           │   │   └── [x] [id].tsx (modal)                 # /screens/vehicles/vehicle-mileage.screen.tsx (VehicleMileageScreen)
  │           │   └── [x] [id].tsx                             # /screens/vehicles/vehicles-detail.tsx (VehicleDetailScreen)
  │           ├── finance/
  │           │   ├── status/
  │           │   │   └── [orgId]/
  │           │   │       └── [x] [chargeTypeId].tsx (modal)   # /screens/finance/finance-status-detail.tsx (FinanceStatusDetailScreen)
  │           │   └── [x] index.tsx                            # /screens/finance/finance.tsx (FinanceScreen)
  │           └── applications/
  │               ├── [x] index.tsx                            # /screens/applications/applications.tsx (ApplicationsScreen)
  │               ├── [x] completed.tsx                        # /screens/applications/applications-completed.tsx (ApplicationsCompletedScreen)
  │               ├── [x] in-progress.tsx                      # /screens/applications/applications-in-progress.tsx (ApplicationsInProgressScreen)
  │               └── [x] incomplete.tsx                       # /screens/applications/applications-incomplete.tsx (ApplicationsIncompleteScreen)

  # Dev/optional (not deep-linked, low priority)
  # [ ] cognito-auth.tsx                                       # /screens/cognito-auth/cognito-auth.tsx (CognitoAuthScreen)
  # [ ] devtools/cognito-auth.tsx                              # /screens/devtools/cognito-auth.tsx (DevtoolsCognitoAuthScreen)
  # [ ] devtools/storybook.tsx                                 # /screens/devtools/storybook.tsx (DevtoolsStorybookScreen)
  # [ ] register-email.tsx                                     # /screens/register-email/register-email.tsx (RegisterEmailScreen)
  # [ ] wallet/passport.tsx                                    # (WalletPassportScreen) - not in routes
