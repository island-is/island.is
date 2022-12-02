import { config } from './config'

const prefix = config.bundleId

export const ComponentRegistry = {
  // dev screens
  DevtoolsStorybookScreen: `${prefix}.screens.DevStorybook`,
  DevtoolsCognitoAuthScreen: `${prefix}.screens.DevCognitoAuth`,

  // screens
  LoginScreen: `${prefix}.screens.Login`,
  AppLockScreen: `${prefix}.screens.AppLock`,
  OnboardingPinCodeScreen: `${prefix}.screens.OnboardingPinCode`,
  OnboardingBiometricsScreen: `${prefix}.screens.OnboardingBiometrics`,
  OnboardingNotificationsScreen: `${prefix}.screens.OnboardingNotifications`,
  HomeScreen: `${prefix}.screens.Home`,
  InboxScreen: `${prefix}.screens.Inbox`,
  ApplicationsScreen: `${prefix}.screens.ApplicationsScreen`,
  WalletScreen: `${prefix}.screens.Wallet`,
  WalletPassScreen: `${prefix}.screens.WalletPass`,
  DocumentDetailScreen: `${prefix}.screens.DocumentDetail`,
  NotificationsScreen: `${prefix}.screens.Notifications`,
  NotificationDetailScreen: `${prefix}.screens.NotificationDetail`,
  WebViewScreen: `${prefix}.screens.WebViewScreen`,
  LicenseScannerScreen: `${prefix}.screens.LicenseScannerScreen`,
  LicenseScanDetailScreen: `${prefix}.screens.LicenseScanDetailScreen`,
  VehiclesScreen: `${prefix}.screens.VehiclesScreen`,
  VehicleDetailScreen: `${prefix}.screens.VehicleDetailScreen`,
  AssetsOverviewScreen: `${prefix}.screens.AssetsOverviewScreen`,
  AssetsDetailScreen: `${prefix}.screens.AssetsDetailScreen`,
  ProfileScreen: `${prefix}.screens.ProfileScreen`,
  PersonalInfoScreen: `${prefix}.screens.PersonalInfoScreen`,
  SettingsScreen: `${prefix}.screens.SettingsScreen`,

  // ui components
  AndroidSearchBar: `${prefix}.ui.AndroidSearchBar`,
}

export const ButtonRegistry = {
  SettingsButton: `${prefix}.button.SettingsButton`,
  // to do remove this unused user button
  UserButton: `${prefix}.button.UserButton`,
  NotificationsButton: `${prefix}.button.NotificationsButton`,
  ShareButton: `${prefix}.button.ShareButton`,
  ScanLicenseButton: `${prefix}.button.ScanLicenseButton`,
  ScanLicenseDoneButton: `${prefix}.button.ScanLicenseDoneButton`,
}

export const StackRegistry = {
  LoginStack: `${prefix}.stack.LoginStack`,
  InboxStack: `${prefix}.stack.InboxStack`,
  HomeStack: `${prefix}.stack.HomeStack`,
  WalletStack: `${prefix}.stack.WalletStack`,
  LicenseScannerStack: `${prefix}.stack.LicenseScannerStack`,
  ProfileStack: `${prefix}.stack.ProfileStack`,
  ApplicationsStack: `${prefix}.stack.ApplicationsStack`,
};


export const MainBottomTabs = `${prefix}.bottomTabs.MainBottomTabs`;

