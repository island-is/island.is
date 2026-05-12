import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { olMessage as om } from './lib/messages'
// NOTE: Features.isServicePortalSailorsPageEnabled will be added to the base repo's
// libs/feature-flags/src/lib/features.ts as part of the feature flag setup.
// import { Features } from '@island.is/react/feature-flags'

const OccupationalLicensesDetailScreen = lazy(() =>
  import('./screens/OccupationalLicensesDetail/OccupationalLicensesDetail'),
)

const OccupationalLicensesOverviewScreen = lazy(() =>
  import('./screens/OccupationalLicensesOverview/OccupationalLicensesOverview'),
)

const SailorSchoolCertificatesScreen = lazy(() =>
  import('./screens/SailorSchoolCertificates/SailorSchoolCertificates'),
)

const SailorRightCertificatesScreen = lazy(() =>
  import('./screens/SailorRightCertificates/SailorRightCertificates'),
)

const SailorCrewRegistrationsScreen = lazy(() =>
  import('./screens/SailorCrewRegistrations/SailorCrewRegistrations'),
)

// key must match the ConfigCat flag name without the "isServicePortal" prefix and "PageEnabled" suffix.
// Flag: isServicePortalSailorsPageEnabled → key: 'SailorsPage'
const SAILORS_FLAG = 'SailorsPage'

export const occupationalLicensesModule: PortalModule = {
  name: m.occupationalLicenses,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.myOccupationalLicenses,
      path: OccupationalLicensesPaths.OccupationalLicensesRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      notAvailableForActors: true,
      element: <OccupationalLicensesOverviewScreen />,
    },
    {
      name: om.singleLicense,
      path: OccupationalLicensesPaths.OccupationalLicensesDetail,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      notAvailableForActors: true,
      element: <OccupationalLicensesDetailScreen />,
    },
    {
      name: m.sailorsSectionTitle,
      path: OccupationalLicensesPaths.SailorsRoot,
      key: SAILORS_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      notAvailableForActors: true,
      element: (
        <Navigate
          to={OccupationalLicensesPaths.SailorsSchoolCertificates}
          replace
        />
      ),
    },
    {
      name: m.sailorsSchoolCertificatesTitle,
      path: OccupationalLicensesPaths.SailorsSchoolCertificates,
      key: SAILORS_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      notAvailableForActors: true,
      element: <SailorSchoolCertificatesScreen />,
    },
    {
      name: m.sailorsRightCertificatesTitle,
      path: OccupationalLicensesPaths.SailorsRightCertificates,
      key: SAILORS_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      notAvailableForActors: true,
      element: <SailorRightCertificatesScreen />,
    },
    {
      name: m.sailorsCrewRegistrationsTitle,
      path: OccupationalLicensesPaths.SailorsCrewRegistrations,
      key: SAILORS_FLAG,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      notAvailableForActors: true,
      element: <SailorCrewRegistrationsScreen />,
    },
  ],
}
