import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { HealthPaths } from './lib/paths'
import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/feature-flags'
import { messages as hm } from './lib/messages'

const HealthOverview = lazy(() =>
  import('./screens/HealthOverview/HealthOverview'),
)
const Therapies = lazy(() => import('./screens/Therapies/Therapies'))

const AidsAndNutrition = lazy(() =>
  import('./screens/AidsAndNutrition/AidsAndNutrition'),
)
const Dentists = lazy(() => import('./screens/Dentists/Dentists'))

const HealthCenter = lazy(() => import('./screens/HealthCenter/HealthCenter'))

const Medicine = lazy(() => import('./screens/Medicine/Medicine'))

const HealthCenterRegistration = lazy(() =>
  import('./screens/HealthCenterRegistration/HealthCenterRegistration'),
)

const DentistRegistration = lazy(() =>
  import('./screens/DentistRegistration/DentistRegistration'),
)

const MedicineCertificate = lazy(() =>
  import('./screens/MedicineCertificate/MedicineCertificate'),
)

const Payments = lazy(() => import('./screens/Payments/Payments'))

export const healthModule: PortalModule = {
  name: 'Heilsa',
  // featureFlag: Features.servicePortalHealthRightsModule,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Heilsa',
      path: HealthPaths.HealthRoot,
      key: 'HealthOverview',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <HealthOverview />,
    },
    {
      name: 'Þjálfun',
      path: HealthPaths.HealthTherapies,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Therapies />,
    },
    {
      name: 'Hjálpartæki og næring',
      path: HealthPaths.HealthAidsAndNutrition,
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <AidsAndNutrition />,
    },
    {
      name: 'Greiðslur',
      path: HealthPaths.HealthPayments,
      key: 'HealthPayment',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Payments />,
    },
    {
      name: 'Tannlæknar',
      path: HealthPaths.HealthDentists,
      key: 'HealthCenter',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Dentists />,
    },
    {
      name: 'Heilsugæsla',
      path: HealthPaths.HealthCenter,
      key: 'HealthCenter',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <HealthCenter />,
    },
    {
      name: hm.medicineTitle,
      path: HealthPaths.HealthMedicine,
      key: 'HealthMedicine',
      enabled: userInfo.scopes.includes(ApiScope.health),
      element: <Medicine />,
    },
    {
      name: hm.medicineLicenseTitle,
      path: HealthPaths.HealthMedicineCertificate,
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
