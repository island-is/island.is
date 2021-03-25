import { config } from "./config";

const prefix = config.bundleId;

export const ComponentRegistry = {
  // screens
  HomeScreen: `${prefix}.screens.Home`,
  InboxScreen: `${prefix}.screens.Inbox`,
  WalletScreen: `${prefix}.screens.Wallet`,
  UserScreen: `${prefix}.screens.User`,
  LoginScreen: `${prefix}.screens.Login`,
  AppLockScreen: `${prefix}.screens.AppLock`,
  WalletPassScreen: `${prefix}.screens.WalletPass`,
  DocumentDetailScreen: `${prefix}.screens.DocumentDetail`,
  StorybookScreen: `${prefix}.screens.Storybook`,

  // ui components
  NavigationBarTitle: `${prefix}.ui.NavigationBarTitle`,
}

export const ButtonRegistry = {
  UserButton: `${prefix}.button.UserButton`
};
