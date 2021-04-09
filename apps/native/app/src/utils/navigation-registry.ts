import { config } from "./config";

const prefix = config.bundleId;

export const ComponentRegistry = {
  // dev screens
  StorybookScreen: `${prefix}.screens.Storybook`,

  // screens
  LoginScreen: `${prefix}.screens.Login`,
  AppLockScreen: `${prefix}.screens.AppLock`,
  OnboardingAppLockScreen: `${prefix}.screens.OnboardingAppLockScreen`,
  OnboardingNotificationsScreen: `${prefix}.screens.OnboardingNotificationsScreen`,
  HomeScreen: `${prefix}.screens.Home`,
  InboxScreen: `${prefix}.screens.Inbox`,
  WalletScreen: `${prefix}.screens.Wallet`,
  UserScreen: `${prefix}.screens.User`,
  WalletPassScreen: `${prefix}.screens.WalletPass`,
  DocumentDetailScreen: `${prefix}.screens.DocumentDetail`,

  // ui components
  NavigationBarTitle: `${prefix}.ui.NavigationBarTitle`,
}

export const ButtonRegistry = {
  UserButton: `${prefix}.button.UserButton`
};
