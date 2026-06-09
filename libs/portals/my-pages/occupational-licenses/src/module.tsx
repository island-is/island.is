import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { PortalModule } from '@island.is/portals/core'
import { OccupationalLicensesPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { olMessage as om } from './lib/messages'
import { Features } from '@island.is/react/feature-flags'

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
      key: Features.isServicePortalSailorsPageEnabled,
      enabled: userInfo.scopes.includes(ApiScope.ships),
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
      key: Features.isServicePortalSailorsPageEnabled,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      element: <SailorSchoolCertificatesScreen />,
    },
    {
      name: m.sailorsRightCertificatesTitle,
      path: OccupationalLicensesPaths.SailorsRightCertificates,
      key: Features.isServicePortalSailorsPageEnabled,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      element: <SailorRightCertificatesScreen />,
    },
    {
      name: m.sailorsCrewRegistrationsTitle,
      path: OccupationalLicensesPaths.SailorsCrewRegistrations,
      key: Features.isServicePortalSailorsPageEnabled,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      element: <SailorCrewRegistrationsScreen />,
    },
  ],
}
