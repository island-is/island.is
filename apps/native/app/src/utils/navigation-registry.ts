import { config } from "./config";

const prefix = config.bundleId;

export const ComponentRegistry = {
  // dev screens
  StorybookScreen: `${prefix}.screens.Storybook`,

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

  // ui components
  NavigationBarTitle: `${prefix}.ui.NavigationBarTitle`,
}

export const ButtonRegistry = {
  UserButton: `${prefix}.button.UserButton`,
  NotificationsButton: `${prefix}.button.NotificationsButton`
};
