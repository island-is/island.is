import { PortalModule } from '@island.is/portals/core'
import { LawAndOrderPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'
import LawAndOrderOverview from './screens/LawAndOrderOverview'
import { m } from '@island.is/service-portal/core'
import CourtCases from './screens/CourtCases'
import CourtCaseDetail from './screens/CourtCaseDetail'

export const lawAndOrderModule: PortalModule = {
  //TODO: Replace with correct scope! .lawAndOrder
  name: m.lawAndOrder,
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
      element: <LawAndOrderOverview />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <CourtCases />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCaseDetail,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <CourtCaseDetail />,
    },
  ],
}
