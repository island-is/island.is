import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { HealthPaths } from './lib/paths'
import { PortalModule } from '@island.is/portals/core'
import { messages as hm } from './lib/messages'
import { m } from '@island.is/service-portal/core'
import { Navigate } from 'react-router-dom'

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

const HealthCenterRegistration = lazy(() =>
  import('./screens/HealthCenterRegistration/HealthCenterRegistration'),
)

const DentistRegistration = lazy(() =>
  import('./screens/DentistRegistration/DentistRegistration'),
)

const MedicineCalculator = lazy(() =>
  import('./screens/Medicine/MedicineCalculator'),
)

const MedicineCertificate = lazy(() =>
  import('./screens/MedicineCertificate/MedicineCertificate'),
)

const PaymentParticipation = lazy(() =>
  import('./screens/Payments/PaymentParticipation'),
)
const PaymentOverview = lazy(() => import('./screens/Payments/PaymentOverview'))

export const healthModule: PortalModule = {
  name: 'Heilsa',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.health,
      path: HealthPaths.HealthRoot,
      key: 'HealthOverview',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <HealthOverview />,
    },
    {
      name: hm.therapyTitle,
      path: HealthPaths.HealthTherapies,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Navigate to={HealthPaths.HealthTherapiesPhysical} replace />,
    },
    {
      name: hm.physicalTherapy,
      path: HealthPaths.HealthTherapiesPhysical,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <TherapiesPhysical />,
    },
    {
      name: hm.speechTherapy,
      path: HealthPaths.HealthTherapiesSpeech,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <TherapiesSpeech />,
    },
    {
      name: hm.occupationalTherapy,
      path: HealthPaths.HealthTherapiesOccupational,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <TherapiesOccupational />,
    },
    {
      name: hm.aidsAndNutritionTitle,
      path: HealthPaths.HealthAidsAndNutrition,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <AidsAndNutrition />,
    },
    {
      name: hm.payments,
      path: HealthPaths.HealthPayments,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Navigate to={HealthPaths.HealthPaymentParticipation} replace />,
    },
    {
      name: hm.paymentParticipation,
      path: HealthPaths.HealthPaymentParticipation,
      key: 'HealthPayment',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <PaymentParticipation />,
    },
    {
      name: hm.paymentOverview,
      path: HealthPaths.HealthPaymentOverview,
      key: 'HealthPayment',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <PaymentOverview />,
    },
    {
      name: hm.dentistsTitle,
      path: HealthPaths.HealthDentists,
      key: 'HealthCenter',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Dentists />,
    },
    {
      name: hm.healthCenterTitle,
      path: HealthPaths.HealthCenter,
      key: 'HealthCenter',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <HealthCenter />,
    },
    {
      name: hm.medicineTitle,
      path: HealthPaths.HealthMedicine,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Navigate to={HealthPaths.HealthMedicinePurchase} replace />,
    },
    {
      name: hm.medicinePurchaseTitle,
      path: HealthPaths.HealthMedicinePurchase,
      key: 'HealthMedicine',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicinePurchase />,
    },
    {
      name: hm.medicineCalculatorTitle,
      path: HealthPaths.HealthMedicineCalculator,
      key: 'HealthMedicine',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicineCalculator />,
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificates,
      key: 'HealthMedicine',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicineLicence />,
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificate,
      key: 'HealthMedicine',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <MedicineCertificate />,
    },
    {
      name: hm.healthCenterRegistrationTitle,
      path: HealthPaths.HealthCenterRegistration,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <HealthCenterRegistration />,
    },
    {
      name: hm.dentistRegisterationPageTitle,
      path: HealthPaths.HealthDentistRegistration,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <DentistRegistration />,
    },
  ],
}
