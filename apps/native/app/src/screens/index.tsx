import { HomeScreen } from './home/home'
import { InboxScreen } from './inbox/inbox'
import { WalletScreen } from './wallet/wallet'
import { UserScreen } from './user/user'
import { LoginScreen } from './login/login'
import { AppLockScreen } from './app-lock/app-lock';
import { WalletPassScreen } from './wallet-pass/wallet-pass';
import { registerComponent } from '../utils/register-component';
import { Navigation } from 'react-native-navigation'
import { NavigationBarTitle } from '../components/navigation-bar-title/navigation-bar-title';
import { ComponentRegistry } from '../utils/navigation-registry';
import { DocumentDetailScreen } from './document-detail/document-detail'
import { StorybookScreen } from './storybook/storybook';
import { OnboardingPinCodeScreen } from './onboarding/onboarding-pin-code'
import { OnboardingNotificationsScreen } from './onboarding/onboarding-notifications'
import { NotificationsScreen } from './notifications/notifications'
import { OnboardingBiometricsScreen } from './onboarding/onboarding-biometrics'

export function registerAllComponents() {
  // dev only
  registerComponent(ComponentRegistry.StorybookScreen, StorybookScreen)

  // screens
  registerComponent(ComponentRegistry.LoginScreen, LoginScreen)
  registerComponent(ComponentRegistry.OnboardingPinCodeScreen, OnboardingPinCodeScreen);
  registerComponent(ComponentRegistry.OnboardingBiometricsScreen, OnboardingBiometricsScreen);
  registerComponent(ComponentRegistry.OnboardingNotificationsScreen, OnboardingNotificationsScreen);
  registerComponent(ComponentRegistry.HomeScreen, HomeScreen)
  registerComponent(ComponentRegistry.InboxScreen, InboxScreen)
  registerComponent(ComponentRegistry.WalletScreen, WalletScreen)
  registerComponent(ComponentRegistry.UserScreen, UserScreen)
  registerComponent(ComponentRegistry.AppLockScreen, AppLockScreen)
  registerComponent(ComponentRegistry.WalletPassScreen, WalletPassScreen);
  registerComponent(ComponentRegistry.DocumentDetailScreen, DocumentDetailScreen);
  registerComponent(ComponentRegistry.NotificationsScreen, NotificationsScreen);

  // ui components
  Navigation.registerComponent(ComponentRegistry.NavigationBarTitle, () => NavigationBarTitle);
}
