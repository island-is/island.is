 ---
  # Expo Router Migration TODO
  # [x] = migrated, [ ] = TODO
  # 64 done / ~6 remaining

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
