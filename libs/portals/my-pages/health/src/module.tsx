import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { Navigate } from 'react-router-dom'
import { messages as hm } from './lib/messages'
import { HealthPaths } from './lib/paths'

const HealthOverview = lazy(() =>
  import('./screens/HealthOverview/HealthOverview'),
)
const TherapiesPhysical = lazy(() =>
  import('./screens/Therapies/TherapiesPhysical'),
)
const TherapiesSpeech = lazy(() =>
  import('./screens/Therapies/TherapiesSpeech'),
)
const TherapiesOccupational = lazy(() =>
  import('./screens/Therapies/TherapiesOccupational'),
)

const AidsAndNutrition = lazy(() =>
  import('./screens/AidsAndNutrition/AidsAndNutrition'),
)
const Dentists = lazy(() => import('./screens/Dentists/Dentists'))

const HealthCenter = lazy(() => import('./screens/HealthCenter/HealthCenter'))

const MedicinePurchase = lazy(() =>
  import('./screens/Medicine/MedicinePurchase'),
)

const MedicineLicence = lazy(() => import('./screens/Medicine/MedicineLicense'))

const MedicineCalculator = lazy(() =>
  import('./screens/MedicineCalculator/MedicineCalculator'),
)

const MedicinePrescriptions = lazy(() =>
  import('./screens/MedicinePrescriptions/MedicinePrescriptions'),
)
const MedicinePrescriptionHistory = lazy(() =>
  import('./screens/MedicinePrescriptions/MedicinePrescriptionHistory'),
)
const HealthCenterRegistration = lazy(() =>
  import('./screens/HealthCenterRegistration/HealthCenterRegistration'),
)

const DentistRegistration = lazy(() =>
  import('./screens/DentistRegistration/DentistRegistration'),
)

const MedicineCertificate = lazy(() =>
  import('./screens/MedicineCertificate/MedicineCertificate'),
)

const MedicineDelegation = lazy(() =>
  import('./screens/MedicineDelegation/MedicineDelegation'),
)

const PaymentParticipation = lazy(() =>
  import('./screens/Payments/PaymentParticipation'),
)
const PaymentOverview = lazy(() => import('./screens/Payments/PaymentOverview'))

const OrganDonation = lazy(() =>
  import('./screens/OrganDonation/OrganDonation'),
)

const OrganDonationRegistration = lazy(() =>
  import('./screens/OrganDonation/components/RegistrationForm'),
)

const Vaccinations = lazy(() =>
  import('./screens/Vaccinations/VaccinationsWrapper'),
)

const MEDICINE_LANDLAEKNIR_FLAG = 'HealthMedicineLandlaeknir'

export const healthModule: PortalModule = {
  name: 'Heilsa',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.health,
      path: HealthPaths.HealthRoot,
      enabled: [
        ApiScope.healthPayments,
        ApiScope.healthMedicines,
        ApiScope.healthAssistiveAndNutrition,
        ApiScope.healthTherapies,
        ApiScope.healthHealthcare,
        ApiScope.healthDentists,
        ApiScope.healthRightsStatus,
      ].some((scope) => userInfo.scopes.includes(scope)),
      element: <Navigate to={HealthPaths.HealthOverview} replace />,
    },
    {
      name: hm.overviewTitle,
      path: HealthPaths.HealthOverview,
      enabled: userInfo.scopes.includes(ApiScope.healthRightsStatus),
      element: <HealthOverview />,
    },
    {
      name: hm.therapyTitle,
      path: HealthPaths.HealthTherapies,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <Navigate to={HealthPaths.HealthTherapiesPhysical} replace />,
    },
    {
      name: hm.physicalTherapy,
      path: HealthPaths.HealthTherapiesPhysical,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesPhysical />,
    },
    {
      name: hm.speechTherapy,
      path: HealthPaths.HealthTherapiesSpeech,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesSpeech />,
    },
    {
      name: hm.occupationalTherapy,
      path: HealthPaths.HealthTherapiesOccupational,
      enabled: userInfo.scopes.includes(ApiScope.healthTherapies),
      element: <TherapiesOccupational />,
    },
    {
      name: hm.aidsAndNutritionTitle,
      path: HealthPaths.HealthAidsAndNutrition,
      enabled: userInfo.scopes.includes(ApiScope.healthAssistiveAndNutrition),
      element: <AidsAndNutrition />,
    },
    {
      name: hm.payments,
      path: HealthPaths.HealthPayments,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <Navigate to={HealthPaths.HealthPaymentParticipation} replace />,
    },
    {
      name: hm.paymentParticipation,
      path: HealthPaths.HealthPaymentParticipation,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentParticipation />,
    },
    {
      name: hm.paymentOverview,
      path: HealthPaths.HealthPaymentOverview,
      enabled: userInfo.scopes.includes(ApiScope.healthPayments),
      element: <PaymentOverview />,
    },
    {
      name: hm.dentistsTitle,
      path: HealthPaths.HealthDentists,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <Dentists />,
    },
    {
      name: hm.healthCenterTitle,
      path: HealthPaths.HealthCenter,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <HealthCenter />,
    },
    {
      name: hm.medicineTitle,
      path: HealthPaths.HealthMedicine,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: (
        <Navigate to={HealthPaths.HealthMedicinePaymentParticipation} replace />
      ),
    },
    {
      name: hm.medicinePrescriptions,
      path: HealthPaths.HealthMedicinePrescription,
      key: MEDICINE_LANDLAEKNIR_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePrescriptions />,
    },
    {
      name: hm.medicinePrescriptionHistory,
      path: HealthPaths.HealthMedicinePrescriptionHistory,
      key: MEDICINE_LANDLAEKNIR_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePrescriptionHistory />,
    },
    // Commented out because not ready yet
    // {
    //   name: hm.medicineDelegation,
    //   path: HealthPaths.HealthMedicineDelegation,
    //   key: MEDICINE_LANDLAEKNIR_FLAG,
    //   enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
    //   element: <MedicineDelegation />,
    // },
    {
      name: hm.medicinePaymentParticipation,
      path: HealthPaths.HealthMedicinePaymentParticipation,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePurchase />,
    },
    {
      name: hm.medicinePurchaseTitle,
      path: HealthPaths.HealthMedicinePurchase,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicinePurchase />,
    },
    {
      name: hm.medicineCalculatorTitle,
      path: HealthPaths.HealthMedicineCalculator,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineCalculator />,
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificates,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineLicence />,
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificate,
      enabled: userInfo.scopes.includes(ApiScope.healthMedicines),
      element: <MedicineCertificate />,
    },

    {
      name: hm.healthCenterRegistrationTitle,
      path: HealthPaths.HealthCenterRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthHealthcare),
      element: <HealthCenterRegistration />,
    },
    {
      name: hm.dentistRegisterationPageTitle,
      path: HealthPaths.HealthDentistRegistration,
      enabled: userInfo.scopes.includes(ApiScope.healthDentists),
      element: <DentistRegistration />,
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonation,
      key: 'HealthOrganDonation',
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <OrganDonation />,
    },
    {
      name: hm.organDonation,
      path: HealthPaths.HealthOrganDonationRegistration,
      key: 'HealthOrganDonation',
      enabled: userInfo.scopes.includes(ApiScope.healthOrganDonation),
      element: <OrganDonationRegistration />,
    },
    {
      name: hm.vaccinations,
      path: HealthPaths.HealthVaccinations,
      key: 'HealthVaccinations',
      enabled: userInfo.scopes.includes(ApiScope.healthVaccinations),
      element: <Vaccinations />,
    },
  ],
}
