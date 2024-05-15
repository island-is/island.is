import { PortalModule } from '@island.is/portals/core'
import { LawAndOrderPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'
import { m } from '@island.is/service-portal/core'
import LawAndOrderIndex from './screens/index'
import { Components } from './lib/const'

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
      element: <LawAndOrderIndex component={Components.OVERVIEW} />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <LawAndOrderIndex component={Components.COURT_CASES} />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCaseDetail,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <LawAndOrderIndex component={Components.COURT_CASE_DETAIL} />,
    },
    {
      name: m.subpeona,
      path: LawAndOrderPaths.SubpeonaDetail,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <LawAndOrderIndex component={Components.SUBPEONA} />,
    },
  ],
}
