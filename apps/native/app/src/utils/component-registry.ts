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
  WalletScreen: `${prefix}.screens.Wallet`,
  UserScreen: `${prefix}.screens.User`,
  WalletPassScreen: `${prefix}.screens.WalletPass`,
  DocumentDetailScreen: `${prefix}.screens.DocumentDetail`,
  NotificationsScreen: `${prefix}.screens.Notifications`,
  NotificationDetailScreen: `${prefix}.screens.NotificationDetail`,
  WebViewScreen: `${prefix}.screens.WebViewScreen`,

  // ui components
  AndroidSearchBar: `${prefix}.ui.AndroidSearchBar`,
}

export const ButtonRegistry = {
  UserButton: `${prefix}.button.UserButton`,
  NotificationsButton: `${prefix}.button.NotificationsButton`,
  ShareButton: `${prefix}.button.ShareButton`,
}
