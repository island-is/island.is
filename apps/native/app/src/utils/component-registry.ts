import { bundleId, isTestingApp } from '../config'

const prefix = bundleId

export const ComponentRegistry = {
  // dev screens
  DevtoolsStorybookScreen: `${prefix}.screens.DevStorybook`,
  DevtoolsCognitoAuthScreen: `${prefix}.screens.DevCognitoAuth`,

  // screens
  AirDiscountScreen: `${prefix}.screens.AirDiscountScreen`,
  ApplicationsCompletedScreen: `${prefix}.screens.ApplicationsCompletedScreen`,
  ApplicationsIncompleteScreen: `${prefix}.screens.ApplicationsIncompleteScreen`,
  ApplicationsInProgressScreen: `${prefix}.screens.ApplicationsInProgressScreen`,
  ApplicationsScreen: `${prefix}.screens.ApplicationsScreen`,
  AppLockScreen: `${prefix}.screens.AppLock`,
  AssetsDetailScreen: `${prefix}.screens.AssetsDetailScreen`,
  AssetsOverviewScreen: `${prefix}.screens.AssetsOverviewScreen`,
  CognitoAuthScreen: `${prefix}.screens.CognitoAuth`,
  DocumentDetailScreen: `${prefix}.screens.DocumentDetail`,
  DocumentReplyScreen: `${prefix}.screens.DocumentReply`,
  EditBankInfoScreen: `${prefix}.screens.EditBankInfoScreen`,
  EditConfirmScreen: `${prefix}.screens.EditConfirmScreen`,
  EditEmailScreen: `${prefix}.screens.EditEmailScreen`,
  EditPhoneScreen: `${prefix}.screens.EditPhoneScreen`,
  FamilyDetailScreen: `${prefix}.screens.FamilyDetailScreen`,
  FamilyScreen: `${prefix}.screens.FamilyScreen`,
  FinanceScreen: `${prefix}.screens.FinanceScreen`,
  FinanceStatusDetailScreen: `${prefix}.screens.FinanceStatusDetailScreen`,
  HealthOverviewScreen: `${prefix}.screens.HealthOverviewScreen`,
  HomeOptionsScreen: `${prefix}.screens.HomeOptions`,
  HomeScreen: `${prefix}.screens.Home`,
  InboxFilterScreen: `${prefix}.screens.InboxFilterScreen`,
  InboxScreen: `${prefix}.screens.Inbox`,
  LicenseScanDetailScreen: `${prefix}.screens.LicenseScanDetailScreen`,
  LicenseScannerScreen: `${prefix}.screens.LicenseScannerScreen`,
  LoginScreen: `${prefix}.screens.${isTestingApp ? `TestingLogin` : `Login`}`,
  MoreScreen: `${prefix}.screens.MoreScreen`,
  NotificationsScreen: `${prefix}.screens.Notifications`,
  OfflineBanner: `${prefix}.overlay.OfflineBanner`,
  OfflineIcon: `${prefix}.navigation.OfflineIcon`,
  OnboardingBiometricsScreen: `${prefix}.screens.OnboardingBiometrics`,
  OnboardingNotificationsScreen: `${prefix}.screens.OnboardingNotifications`,
  OnboardingPinCodeScreen: `${prefix}.screens.OnboardingPinCode`,
  PasskeyScreen: `${prefix}.screens.PasskeyScreen`,
  PersonalInfoScreen: `${prefix}.screens.PersonalInfoScreen`,
  RegisterEmailScreen: `${prefix}.screens.RegisterEmailScreen`,
  SettingsScreen: `${prefix}.screens.SettingsScreen`,
  UpdateAppScreen: `${prefix}.screens.UpdateAppScreen`,
  VaccinationsScreen: `${prefix}.screens.VaccinationsScreen`,
  VehicleDetailScreen: `${prefix}.screens.VehicleDetailScreen`,
  VehicleMileageScreen: `${prefix}.screens.VehicleMileageScreen`,
  VehiclesScreen: `${prefix}.screens.VehiclesScreen`,
  WalletPassportScreen: `${prefix}.screens.WalletPassport`,
  WalletPassScreen: `${prefix}.screens.WalletPass`,
  WalletScreen: `${prefix}.screens.Wallet`,
  WebViewScreen: `${prefix}.screens.WebViewScreen`,
} as const

export const ButtonRegistry = {
  LoadingButton: `${prefix}.button.LoadingButton`,
  OfflineButton: `${prefix}.button.OfflineButton`,
  SettingsButton: `${prefix}.button.SettingsButton`,
  // to do remove this unused user button
  UserButton: `${prefix}.button.UserButton`,
  NotificationsButton: `${prefix}.button.NotificationsButton`,
  ShareButton: `${prefix}.button.ShareButton`,
  ScanLicenseButton: `${prefix}.button.ScanLicenseButton`,
  ScanLicenseDoneButton: `${prefix}.button.ScanLicenseDoneButton`,
  DocumentStarButton: `${prefix}.button.DocumentStarButton`,
  DocumentArchiveButton: `${prefix}.button.DocumentArchiveButton`,
  InboxFilterClearButton: `${prefix}.button.InboxFilterClearButton`,
  HomeScreenOptionsButton: `${prefix}.button.HomeScreenOptionsButton`,
  InboxBulkSelectButton: `${prefix}.button.InboxBulkSelectButton`,
  InboxBulkSelectAllButton: `${prefix}.button.InboxBulkSelectAllButton`,
  InboxBulkDeselectAllButton: `${prefix}.button.InboxBulkDeselectAllButton`,
  InboxBulkSelectCancelButton: `${prefix}.button.InboxBulkSelectCancelButton`,
}

export const StackRegistry = {
  LoginStack: `${prefix}.stack.LoginStack`,
  InboxStack: `${prefix}.stack.InboxStack`,
  HomeStack: `${prefix}.stack.HomeStack`,
  WalletStack: `${prefix}.stack.WalletStack`,
  LicenseScannerStack: `${prefix}.stack.LicenseScannerStack`,
  MoreStack: `${prefix}.stack.MoreStack`,
  ApplicationsStack: `${prefix}.stack.ApplicationsStack`,
}

export const MainBottomTabs = `${prefix}.bottomTabs.MainBottomTabs`
