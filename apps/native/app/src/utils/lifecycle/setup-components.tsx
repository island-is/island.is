import { DropdownMenuOverlay } from '../../components/dropdown/dropdown-menu-overlay'
import { LoadingIcon } from '../../components/nav-loading-spinner/loading-icon'
import { OfflineBanner } from '../../components/offline/offline-banner'
import { isTestingApp } from '../../config'
import { AirDiscountScreen } from '../../screens/air-discount/air-discount'
import { AppLockScreen } from '../../screens/app-lock/app-lock'
import { ApplicationsScreen } from '../../screens/applications/applications'
import { ApplicationsCompletedScreen } from '../../screens/applications/applications-completed'
import { ApplicationsInProgressScreen } from '../../screens/applications/applications-in-progress'
import { ApplicationsIncompleteScreen } from '../../screens/applications/applications-incomplete'
import { AssetsDetailScreen } from '../../screens/assets/assets-detail'
import { AssetsOverviewScreen } from '../../screens/assets/assets-overview'
import { CognitoAuthScreen } from '../../screens/cognito-auth/cognito-auth'
import { DocumentCommunicationsScreen } from '../../screens/document-detail/document-communications'
import { DocumentDetailScreen } from '../../screens/document-detail/document-detail'
import { DocumentReplyScreen } from '../../screens/document-detail/document-reply'
import { FamilyDetailScreen } from '../../screens/family/family-details'
import { FamilyOverviewScreen } from '../../screens/family/family-overview'
import { FinanceScreen } from '../../screens/finance/finance'
import { FinanceStatusDetailScreen } from '../../screens/finance/finance-status-detail'
import { HealthOverviewScreen } from '../../screens/health/health-overview'
import { QuestionnaireDetailScreen } from '../../screens/health/questionnaires/questionnaire-detail'
import { QuestionnairesScreen } from '../../screens/health/questionnaires/questionnaires'
import { HomeScreen } from '../../screens/home/home'
import { HomeOptionsScreen } from '../../screens/home/home-options'
import { InboxScreen } from '../../screens/inbox/inbox'
import { InboxFilterScreen } from '../../screens/inbox/inbox-filter'
import { LicenseScanDetailScreen } from '../../screens/license-scanner/license-scan-detail'
import { LicenseScannerScreen } from '../../screens/license-scanner/license-scanner'
import { LoginScreen } from '../../screens/login/login'
import { TestingLoginScreen } from '../../screens/login/testing-login'
import { MoreScreen } from '../../screens/more/more'
import { PersonalInfoScreen } from '../../screens/more/personal-info'
import { NotificationsScreen } from '../../screens/notifications/notifications'
import { OnboardingBiometricsScreen } from '../../screens/onboarding/onboarding-biometrics'
import { OnboardingNotificationsScreen } from '../../screens/onboarding/onboarding-notifications'
import { OnboardingPinCodeScreen } from '../../screens/onboarding/onboarding-pin-code'
import { PasskeyScreen } from '../../screens/passkey/passkey'
import { PrescriptionsScreen } from '../../screens/medicine/prescriptions'
import { MedicineHistoryDetailScreen } from '../../screens/medicine/components/medicine-history-detail'
import { MedicineHistoryScreen } from '../../screens/medicine/components/medicine-history'
import { RegisterEmailScreen } from '../../screens/register-email/register-email'
import { EditBankInfoScreen } from '../../screens/settings/edit-bank-info'
import { EditConfirmScreen } from '../../screens/settings/edit-confirm'
import { EditEmailScreen } from '../../screens/settings/edit-email'
import { EditPhoneScreen } from '../../screens/settings/edit-phone'
import { SettingsScreen } from '../../screens/settings/settings'
import { UpdateAppScreen } from '../../screens/update-app/update-app'
import { VaccinationsScreen } from '../../screens/vaccinations/vaccinations'
import { VehicleMileageScreen } from '../../screens/vehicles/vehicle-mileage.screen'
import { VehiclesScreen } from '../../screens/vehicles/vehicles'
import { VehicleDetailScreen } from '../../screens/vehicles/vehicles-detail'
import { WalletPassScreen } from '../../screens/wallet-pass/wallet-pass'
import { WalletScreen } from '../../screens/wallet/wallet'
import { WebViewScreen } from '../../screens/webview/webview'
import {
  ButtonRegistry as BR,
  ComponentRegistry as CR,
} from '../component-registry'
import { registerComponent } from '../register-component'

export function registerAllComponents() {
  // screens
  registerComponent(
    CR.LoginScreen,
    isTestingApp ? TestingLoginScreen : LoginScreen,
  )
  registerComponent(CR.OnboardingPinCodeScreen, OnboardingPinCodeScreen)
  registerComponent(CR.OnboardingBiometricsScreen, OnboardingBiometricsScreen)
  registerComponent(
    CR.OnboardingNotificationsScreen,
    OnboardingNotificationsScreen,
  )

  /**
   * Tab screens
   */
  registerComponent(CR.InboxScreen, InboxScreen)
  registerComponent(CR.WalletScreen, WalletScreen)
  registerComponent(CR.HomeScreen, HomeScreen)
  registerComponent(CR.ApplicationsScreen, ApplicationsScreen)
  registerComponent(CR.MoreScreen, MoreScreen)

  registerComponent(CR.AppLockScreen, AppLockScreen)
  registerComponent(CR.WalletPassScreen, WalletPassScreen)
  registerComponent(CR.NotificationsScreen, NotificationsScreen)
  registerComponent(CR.WebViewScreen, WebViewScreen)
  registerComponent(CR.LicenseScannerScreen, LicenseScannerScreen)
  registerComponent(CR.LicenseScanDetailScreen, LicenseScanDetailScreen)
  registerComponent(CR.VehiclesScreen, VehiclesScreen)
  registerComponent(CR.VehicleDetailScreen, VehicleDetailScreen)
  registerComponent(CR.VehicleMileageScreen, VehicleMileageScreen)
  registerComponent(CR.FamilyScreen, FamilyOverviewScreen)
  registerComponent(CR.FamilyDetailScreen, FamilyDetailScreen)
  registerComponent(CR.PersonalInfoScreen, PersonalInfoScreen)
  registerComponent(CR.AssetsOverviewScreen, AssetsOverviewScreen)
  registerComponent(CR.AssetsDetailScreen, AssetsDetailScreen)
  registerComponent(CR.SettingsScreen, SettingsScreen)
  registerComponent(CR.EditEmailScreen, EditEmailScreen)
  registerComponent(CR.EditPhoneScreen, EditPhoneScreen)
  registerComponent(CR.EditBankInfoScreen, EditBankInfoScreen)
  registerComponent(CR.EditConfirmScreen, EditConfirmScreen)
  registerComponent(CR.CognitoAuthScreen, CognitoAuthScreen)
  registerComponent(CR.FinanceScreen, FinanceScreen)
  registerComponent(CR.FinanceStatusDetailScreen, FinanceStatusDetailScreen)
  registerComponent(CR.InboxFilterScreen, InboxFilterScreen)
  registerComponent(CR.AirDiscountScreen, AirDiscountScreen)
  registerComponent(CR.PasskeyScreen, PasskeyScreen)
  registerComponent(CR.UpdateAppScreen, UpdateAppScreen)
  registerComponent(CR.HealthOverviewScreen, HealthOverviewScreen)
  registerComponent(CR.QuestionnairesScreen, QuestionnairesScreen)
  registerComponent(CR.QuestionnaireDetailScreen, QuestionnaireDetailScreen)
  registerComponent(CR.HomeOptionsScreen, HomeOptionsScreen)
  registerComponent(CR.ApplicationsCompletedScreen, ApplicationsCompletedScreen)
  registerComponent(
    CR.ApplicationsInProgressScreen,
    ApplicationsInProgressScreen,
  )
  registerComponent(
    CR.ApplicationsIncompleteScreen,
    ApplicationsIncompleteScreen,
  )
  registerComponent(CR.VaccinationsScreen, VaccinationsScreen)
  registerComponent(CR.PrescriptionsScreen, PrescriptionsScreen)
  registerComponent(CR.MedicineHistoryDetailScreen, MedicineHistoryDetailScreen)
  registerComponent(CR.MedicineHistoryScreen, MedicineHistoryScreen)

  registerComponent(CR.RegisterEmailScreen, RegisterEmailScreen)

  // Overlay
  registerComponent(CR.OfflineBanner, OfflineBanner)
  registerComponent(CR.DropdownMenuOverlay, DropdownMenuOverlay)

  // Navigation buttons
  registerComponent(BR.LoadingButton, LoadingIcon)

  // Document screens
  registerComponent(CR.DocumentDetailScreen, DocumentDetailScreen)
  registerComponent(CR.DocumentReplyScreen, DocumentReplyScreen)
  registerComponent(
    CR.DocumentCommunicationsScreen,
    DocumentCommunicationsScreen,
  )
}
