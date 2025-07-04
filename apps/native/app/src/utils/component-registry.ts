import { bundleId, isTestingApp } from '../config'

const prefix = bundleId

export const ComponentRegistry = {
  // dev screens
  DevtoolsCognitoAuthScreen: `${prefix}.screens.DevCognitoAuth`,
  DevtoolsStorybookScreen: `${prefix}.screens.DevStorybook`,

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
  DocumentCommunicationsScreen: `${prefix}.screens.DocumentCommunications`,
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
  DocumentArchiveButton: `${prefix}.button.DocumentArchiveButton`,
  DocumentStarButton: `${prefix}.button.DocumentStarButton`,
  HomeScreenOptionsButton: `${prefix}.button.HomeScreenOptionsButton`,
  InboxBulkDeselectAllButton: `${prefix}.button.InboxBulkDeselectAllButton`,
  InboxBulkSelectAllButton: `${prefix}.button.InboxBulkSelectAllButton`,
  InboxBulkSelectButton: `${prefix}.button.InboxBulkSelectButton`,
  InboxBulkSelectCancelButton: `${prefix}.button.InboxBulkSelectCancelButton`,
  InboxFilterClearButton: `${prefix}.button.InboxFilterClearButton`,
  LoadingButton: `${prefix}.button.LoadingButton`,
  NotificationsButton: `${prefix}.button.NotificationsButton`,
  OfflineButton: `${prefix}.button.OfflineButton`,
  ScanLicenseButton: `${prefix}.button.ScanLicenseButton`,
  ScanLicenseDoneButton: `${prefix}.button.ScanLicenseDoneButton`,
  SettingsButton: `${prefix}.button.SettingsButton`,
  ShareButton: `${prefix}.button.ShareButton`,
}

export const StackRegistry = {
  ApplicationsStack: `${prefix}.stack.ApplicationsStack`,
  HomeStack: `${prefix}.stack.HomeStack`,
  InboxStack: `${prefix}.stack.InboxStack`,
  LicenseScannerStack: `${prefix}.stack.LicenseScannerStack`,
  LoginStack: `${prefix}.stack.LoginStack`,
  MoreStack: `${prefix}.stack.MoreStack`,
  WalletStack: `${prefix}.stack.WalletStack`,
}

export const MainBottomTabs = `${prefix}.bottomTabs.MainBottomTabs`
