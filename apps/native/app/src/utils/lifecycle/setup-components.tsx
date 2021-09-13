import { CognitoAuthScreen } from '../../screens/devtools/cognito-auth'
import { StorybookScreen } from '../../screens/devtools/storybook'
import { LicenseScanDetailScreen } from '../../screens/license-scanner/license-scan-detail'
import { LicenseScannerScreen } from '../../screens/license-scanner/license-scanner'
import { LoginScreen } from '../../screens/login/login'
import { ScannerHomeScreen } from '../../screens/scanner-home/ScannerHome'
import { ComponentRegistry as CR } from '../component-registry'
import { registerComponent } from '../register-component'

export function registerAllComponents() {
  // dev only
  if (__DEV__) {
    registerComponent(CR.DevtoolsStorybookScreen, StorybookScreen)
    registerComponent(CR.DevtoolsCognitoAuthScreen, CognitoAuthScreen)
  }

  // screens
  registerComponent(CR.LoginScreen, LoginScreen);
  // registerComponent(CR.OnboardingPinCodeScreen, OnboardingPinCodeScreen)
  // registerComponent(CR.OnboardingBiometricsScreen, OnboardingBiometricsScreen)
  // registerComponent(CR.OnboardingNotificationsScreen, OnboardingNotificationsScreen)
  // registerComponent(CR.HomeScreen, HomeScreen)
  // registerComponent(CR.InboxScreen, InboxScreen)
  // registerComponent(CR.WalletScreen, WalletScreen)
  // registerComponent(CR.ApplicationsScreen, ApplicationsScreen)
  // registerComponent(CR.UserScreen, UserScreen)
  // registerComponent(CR.AppLockScreen, AppLockScreen)
  // registerComponent(CR.WalletPassScreen, WalletPassScreen)
  // registerComponent(CR.DocumentDetailScreen, DocumentDetailScreen)
  // registerComponent(CR.NotificationsScreen, NotificationsScreen)
  // registerComponent(CR.NotificationDetailScreen, NotificationDetailScreen)
  // registerComponent(CR.WebViewScreen, WebViewScreen);
  registerComponent(CR.LicenseScannerScreen, LicenseScannerScreen);
  registerComponent(CR.LicenseScanDetailScreen, LicenseScanDetailScreen);
  registerComponent(CR.ScannerHomeScreen, ScannerHomeScreen);

  // ui components
  // if (Platform.OS === 'android') {
    // Navigation.registerComponent(CR.AndroidSearchBar, () => AndroidSearchBar)
  // }
}
