import { Navigation } from 'react-native-navigation'
import { HomeScreen } from '../../screens/home/home'
import { InboxScreen } from '../../screens/inbox/inbox'
import { WalletScreen } from '../../screens/wallet/wallet'
import { SettingsScreen } from '../../screens/settings/settings'
import { LoginScreen } from '../../screens/login/login'
import { AppLockScreen } from '../../screens/app-lock/app-lock';
import { WalletPassScreen } from '../../screens/wallet-pass/wallet-pass';
import { NavigationBarTitle } from '../../components/navigation-bar-title/navigation-bar-title';
import { DocumentDetailScreen } from '../../screens/document-detail/document-detail'
import { StorybookScreen } from '../../screens/devtools/storybook';
import { OnboardingPinCodeScreen } from '../../screens/onboarding/onboarding-pin-code'
import { OnboardingNotificationsScreen } from '../../screens/onboarding/onboarding-notifications'
import { NotificationsScreen } from '../../screens/notifications/notifications'
import { NotificationDetailScreen } from '../../screens/notification-detail/notification-detail'
import { OnboardingBiometricsScreen } from '../../screens/onboarding/onboarding-biometrics'
import { CognitoAuthScreen } from '../../screens/devtools/cognito-auth'
import { registerComponent } from '../register-component';
import { ComponentRegistry } from '../navigation-registry';
import { NavigationBarButton } from '../../components/navigation-bar-button/navigation-bar-button'

export function registerAllComponents() {
  // dev only
  registerComponent(ComponentRegistry.DevtoolsStorybookScreen, StorybookScreen)
  registerComponent(ComponentRegistry.DevtoolsCognitoAuthScreen, CognitoAuthScreen);

  // screens
  registerComponent(ComponentRegistry.LoginScreen, LoginScreen)
  registerComponent(ComponentRegistry.OnboardingPinCodeScreen, OnboardingPinCodeScreen);
  registerComponent(ComponentRegistry.OnboardingBiometricsScreen, OnboardingBiometricsScreen);
  registerComponent(ComponentRegistry.OnboardingNotificationsScreen, OnboardingNotificationsScreen);
  registerComponent(ComponentRegistry.HomeScreen, HomeScreen)
  registerComponent(ComponentRegistry.InboxScreen, InboxScreen)
  registerComponent(ComponentRegistry.WalletScreen, WalletScreen)
  registerComponent(ComponentRegistry.SettingsScreen, SettingsScreen)
  registerComponent(ComponentRegistry.AppLockScreen, AppLockScreen)
  registerComponent(ComponentRegistry.WalletPassScreen, WalletPassScreen);
  registerComponent(ComponentRegistry.DocumentDetailScreen, DocumentDetailScreen);
  registerComponent(ComponentRegistry.NotificationsScreen, NotificationsScreen);
  registerComponent(ComponentRegistry.NotificationDetailScreen, NotificationDetailScreen);

  // ui components
  Navigation.registerComponent(ComponentRegistry.NavigationBarTitle, () => NavigationBarTitle);
  Navigation.registerComponent(ComponentRegistry.NavigationBarButton, () => NavigationBarButton);
}
