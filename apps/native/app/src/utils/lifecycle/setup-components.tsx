// import { Platform } from 'react-native'
import {Navigation} from 'react-native-navigation';
import {AppLockScreen} from '../../screens/app-lock/app-lock';
// import { CognitoAuthScreen } from '../../screens/devtools/cognito-auth'
// import { StorybookScreen } from '../../screens/devtools/storybook'
import {DocumentDetailScreen} from '../../screens/document-detail/document-detail';
import {HomeScreen} from '../../screens/home/home';
import {InboxScreen} from '../../screens/inbox/inbox';
import {LicenseScanDetailScreen} from '../../screens/license-scanner/license-scan-detail';
import {LicenseScannerScreen} from '../../screens/license-scanner/license-scanner';
import {LoginScreen} from '../../screens/login/login';
import {NotificationDetailScreen} from '../../screens/notification-detail/notification-detail';
import {NotificationsScreen} from '../../screens/notifications/notifications';
import {OnboardingBiometricsScreen} from '../../screens/onboarding/onboarding-biometrics';
import {OnboardingNotificationsScreen} from '../../screens/onboarding/onboarding-notifications';
import {OnboardingPinCodeScreen} from '../../screens/onboarding/onboarding-pin-code';
import {WalletPassScreen} from '../../screens/wallet-pass/wallet-pass';
import {WalletScreen} from '../../screens/wallet/wallet';
import {ApplicationsScreen} from '../../screens/applications/applications';
import {WebViewScreen} from '../../screens/webview/webview';
import {ComponentRegistry as CR} from '../component-registry';
import {registerComponent} from '../register-component';
import {VehiclesScreen} from '../../screens/vehicles/vehicles';
import {MoreScreen} from '../../screens/more/more';
import {VehicleDetailScreen} from '../../screens/vehicles/vehicles-detail';
import {PersonalInfoScreen} from '../../screens/more/personal-info';
import {SettingsScreen} from '../../screens/settings/settings';
import {AssetsOverviewScreen} from '../../screens/assets/assets-overview';
import {AssetsDetailScreen} from '../../screens/assets/assets-detail';
import {FamilyOverviewScreen} from '../../screens/family/family-overview';
import {FamilyDetailScreen} from '../../screens/family/family-details';
import {EditEmailScreen} from '../../screens/settings/edit-email';
import {EditPhoneScreen} from '../../screens/settings/edit-phone';
import {EditBankInfoScreen} from '../../screens/settings/edit-bank-info';
import {EditConfirmScreen} from '../../screens/settings/edit-confirm';
import {WalletPassportScreen} from '../../screens/wallet-passport/wallet-passport';
import {CognitoAuthScreen} from '../../screens/cognito-auth/cognito-auth';
import {isTestingApp} from '../../config';
import {TestingLoginScreen} from '../../screens/login/testing-login';
import {FinanceScreen} from '../../screens/finance/finance';
import {FinanceStatusDetailScreen} from '../../screens/finance/finance-status-detail';
import {InboxFilterScreen} from '../../screens/inbox/inbox-filter';
import { VehicleMileageScreen } from '../../screens/vehicles/vehicle-mileage.screen';

export function registerAllComponents() {
  // dev only
  if (__DEV__) {
    // registerComponent(CR.DevtoolsStorybookScreen, StorybookScreen)
    // registerComponent(CR.DevtoolsCognitoAuthScreen, CognitoAuthScreen)
  }

  // screens
  registerComponent(
    CR.LoginScreen,
    isTestingApp ? TestingLoginScreen : LoginScreen,
  );
  registerComponent(CR.OnboardingPinCodeScreen, OnboardingPinCodeScreen);
  registerComponent(CR.OnboardingBiometricsScreen, OnboardingBiometricsScreen);
  registerComponent(
    CR.OnboardingNotificationsScreen,
    OnboardingNotificationsScreen,
  );
  registerComponent(CR.HomeScreen, HomeScreen);
  registerComponent(CR.InboxScreen, InboxScreen);
  registerComponent(CR.WalletScreen, WalletScreen);
  registerComponent(CR.ApplicationsScreen, ApplicationsScreen);
  registerComponent(CR.AppLockScreen, AppLockScreen);
  registerComponent(CR.WalletPassScreen, WalletPassScreen);
  registerComponent(CR.WalletPassportScreen, WalletPassportScreen);
  registerComponent(CR.DocumentDetailScreen, DocumentDetailScreen);
  registerComponent(CR.NotificationsScreen, NotificationsScreen);
  registerComponent(CR.NotificationDetailScreen, NotificationDetailScreen);
  registerComponent(CR.WebViewScreen, WebViewScreen);
  registerComponent(CR.LicenseScannerScreen, LicenseScannerScreen);
  registerComponent(CR.LicenseScanDetailScreen, LicenseScanDetailScreen);
  registerComponent(CR.VehiclesScreen, VehiclesScreen);
  registerComponent(CR.VehicleDetailScreen, VehicleDetailScreen);
  registerComponent(CR.VehicleMileageScreen, VehicleMileageScreen);
  registerComponent(CR.FamilyScreen, FamilyOverviewScreen);
  registerComponent(CR.FamilyDetailScreen, FamilyDetailScreen);
  registerComponent(CR.MoreScreen, MoreScreen);
  registerComponent(CR.PersonalInfoScreen, PersonalInfoScreen);
  registerComponent(CR.AssetsOverviewScreen, AssetsOverviewScreen);
  registerComponent(CR.AssetsDetailScreen, AssetsDetailScreen);
  registerComponent(CR.SettingsScreen, SettingsScreen);
  registerComponent(CR.EditEmailScreen, EditEmailScreen);
  registerComponent(CR.EditPhoneScreen, EditPhoneScreen);
  registerComponent(CR.EditBankInfoScreen, EditBankInfoScreen);
  registerComponent(CR.EditConfirmScreen, EditConfirmScreen);
  registerComponent(CR.CognitoAuthScreen, CognitoAuthScreen);
  registerComponent(CR.FinanceScreen, FinanceScreen);
  registerComponent(CR.FinanceStatusDetailScreen, FinanceStatusDetailScreen);
  registerComponent(CR.InboxFilterScreen, InboxFilterScreen);
}
