import { PortalModule } from '@island.is/portals/core'
import { LawAndOrderPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'
import { m } from '@island.is/service-portal/core'
import { Components } from './lib/const'
import { lazy } from 'react'
import { Features } from '@island.is/feature-flags'

const IndexComponent = lazy(() => import('./screens/index'))

export const lawAndOrderModule: PortalModule = {
  //TODO: Replace with correct scope! .lawAndOrder

  name: m.lawAndOrder,
  featureFlag: Features.servicePortalLawAndOrderModuleEnabled,
  routes: ({ userInfo }) => [
    {
      name: m.lawAndOrder,
      path: LawAndOrderPaths.Root,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <Navigate to={LawAndOrderPaths.Overview} replace />,
    },
    {
      name: m.overview,
      path: LawAndOrderPaths.Overview,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <IndexComponent component={Components.OVERVIEW} />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <IndexComponent component={Components.COURT_CASES} />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCaseDetail,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <IndexComponent component={Components.COURT_CASE_DETAIL} />,
    },
    {
      name: m.subpoena,
      path: LawAndOrderPaths.SubpoenaDetail,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <IndexComponent component={Components.SUBPOENA} />,
    },
  ],
}
