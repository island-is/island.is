import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'

import { LawAndOrderPaths } from './lib/paths'
import PoliceCaseDetail from './screens/PoliceCaseDetail/PoliceCaseDetail'
import PoliceCases from './screens/PoliceCases/PoliceCases'
import Verdict from './screens/Verdict/Verdict'

const CourtCases = lazy(() => import('./screens/CourtCases/CourtCases'))
const CourtCaseDetail = lazy(() =>
  import('./screens/CourtCaseDetail/CourtCaseDetail'),
)
const Subpoena = lazy(() => import('./screens/Subpoena/Subpoena'))
const DriversPoints = lazy(() =>
  import('./screens/DriversPoints/DriversPoints'),
)
const DriversDeprivations = lazy(() =>
  import('./screens/DriversDeprivations/DriversDeprivations'),
)
export const lawAndOrderModule: PortalModule = {
  name: m.lawAndOrder,
  routes: ({ userInfo }) => [
    {
      name: m.lawAndOrder,
      path: LawAndOrderPaths.Root,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      element: <Navigate to={LawAndOrderPaths.PoliceCases} replace />,
    },
    {
      name: m.lawAndOrder,
      path: LawAndOrderPaths.OverviewRedirect,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      navHide: true,
      element: <Navigate to={LawAndOrderPaths.Root} replace />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      element: <CourtCases />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCaseDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      element: <CourtCaseDetail />,
    },
    {
      name: m.subpoena,
      path: LawAndOrderPaths.SubpoenaDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      element: <Subpoena />,
    },
    {
      name: m.policeCases,
      path: LawAndOrderPaths.PoliceCases,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      key: 'PoliceCases',
      element: <PoliceCases />,
    },
    {
      name: m.policeCases,
      path: LawAndOrderPaths.PoliceCasesDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      key: 'PoliceCases',
      element: <PoliceCaseDetail />,
    },
    {
      name: m.case,
      path: LawAndOrderPaths.VerdictDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      requiredScopes: [ApiScope.lawAndOrder],
      element: <Verdict />,
    },
    {
      name: m.driversPoints,
      path: LawAndOrderPaths.DriversPoints,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <DriversPoints />,
    },
    {
      name: m.driversDeprivations,
      path: LawAndOrderPaths.DriversDeprivations,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <DriversDeprivations />,
    },
  ],
}
