import { Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { AndroidSearchBar } from '../../components/android-search-bar/android-search-bar'
import { AppLockScreen } from '../../screens/app-lock/app-lock'
import { CognitoAuthScreen } from '../../screens/devtools/cognito-auth'
import { StorybookScreen } from '../../screens/devtools/storybook'
import { DocumentDetailScreen } from '../../screens/document-detail/document-detail'
import { HomeScreen } from '../../screens/home/home'
import { InboxScreen } from '../../screens/inbox/inbox'
import { LicenseScanDetailScreen } from '../../screens/license-scanner/license-scan-detail'
import { LicenseScannerScreen } from '../../screens/license-scanner/license-scanner'
import { LoginScreen } from '../../screens/login/login'
import { NotificationDetailScreen } from '../../screens/notification-detail/notification-detail'
import { NotificationsScreen } from '../../screens/notifications/notifications'
import { OnboardingBiometricsScreen } from '../../screens/onboarding/onboarding-biometrics'
import { OnboardingNotificationsScreen } from '../../screens/onboarding/onboarding-notifications'
import { OnboardingPinCodeScreen } from '../../screens/onboarding/onboarding-pin-code'
import { UserScreen } from '../../screens/user/user'
import { WalletPassScreen } from '../../screens/wallet-pass/wallet-pass'
import { WalletScreen } from '../../screens/wallet/wallet'
import { ApplicationsScreen } from '../../screens/applications/applications'
import { WebViewScreen } from '../../screens/webview/webview'
import { ComponentRegistry as CR } from '../component-registry'
import { registerComponent } from '../register-component'

export function registerAllComponents() {
  // dev only
  if (__DEV__) {
    registerComponent(CR.DevtoolsStorybookScreen, StorybookScreen)
    registerComponent(CR.DevtoolsCognitoAuthScreen, CognitoAuthScreen)
  }

  // screens
  registerComponent(CR.LoginScreen, LoginScreen)
  registerComponent(CR.OnboardingPinCodeScreen, OnboardingPinCodeScreen)
  registerComponent(CR.OnboardingBiometricsScreen, OnboardingBiometricsScreen)
  registerComponent(CR.OnboardingNotificationsScreen, OnboardingNotificationsScreen)
  registerComponent(CR.HomeScreen, HomeScreen)
  registerComponent(CR.InboxScreen, InboxScreen)
  registerComponent(CR.WalletScreen, WalletScreen)
  registerComponent(CR.ApplicationsScreen, ApplicationsScreen)
  registerComponent(CR.UserScreen, UserScreen)
  registerComponent(CR.AppLockScreen, AppLockScreen)
  registerComponent(CR.WalletPassScreen, WalletPassScreen)
  registerComponent(CR.DocumentDetailScreen, DocumentDetailScreen)
  registerComponent(CR.NotificationsScreen, NotificationsScreen)
  registerComponent(CR.NotificationDetailScreen, NotificationDetailScreen)
  registerComponent(CR.WebViewScreen, WebViewScreen);
  registerComponent(CR.LicenseScannerScreen, LicenseScannerScreen);
  registerComponent(CR.LicenseScanDetailScreen, LicenseScanDetailScreen);

  // ui components
  // if (Platform.OS === 'android') {
    Navigation.registerComponent(CR.AndroidSearchBar, () => AndroidSearchBar)
  // }
}
