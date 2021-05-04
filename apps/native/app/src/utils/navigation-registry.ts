import { config } from "./config";

const prefix = config.bundleId;

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
  SettingsScreen: `${prefix}.screens.Settings`,
  WalletPassScreen: `${prefix}.screens.WalletPass`,
  DocumentDetailScreen: `${prefix}.screens.DocumentDetail`,
  NotificationsScreen: `${prefix}.screens.Notifications`,
  NotificationDetailScreen:  `${prefix}.screens.NotificationDetail`,

  // ui components
  NavigationBarTitle: `${prefix}.ui.NavigationBarTitle`,
}

export const ButtonRegistry = {
  UserButton: `${prefix}.button.UserButton`,
  NotificationsButton: `${prefix}.button.NotificationsButton`
};
