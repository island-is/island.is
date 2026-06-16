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

const CompetencyCertificatesScreen = lazy(() =>
  import('./screens/Sailors/CompetencyCertificates/CompetencyCertificates'),
)

const RightCertificatesScreen = lazy(() =>
  import('./screens/Sailors/RightCertificates/RightCertificates'),
)

const LegalRegistrationsScreen = lazy(() =>
  import('./screens/Sailors/LegalRegistrations/LegalRegistrations'),
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
      element: <CompetencyCertificatesScreen />,
    },
    {
      name: m.sailorsRightCertificatesTitle,
      path: OccupationalLicensesPaths.SailorsRightCertificates,
      key: Features.isServicePortalSailorsPageEnabled,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      element: <RightCertificatesScreen />,
    },
    {
      name: m.sailorsCrewRegistrationsTitle,
      path: OccupationalLicensesPaths.SailorsCrewRegistrations,
      key: Features.isServicePortalSailorsPageEnabled,
      enabled: userInfo.scopes.includes(ApiScope.ships),
      element: <LegalRegistrationsScreen />,
    },
  ],
}
