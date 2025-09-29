import { PortalModule } from '@island.is/portals/core'
import { LawAndOrderPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'
import { DOMSMALARADUNEYTID_SLUG, m, RIKISLOGREGLUSTJORI_SLUG } from '@island.is/portals/my-pages/core'
import { lazy } from 'react'
import PoliceCaseDetail from './screens/PoliceCaseDetail/PoliceCaseDetail'

const Overview = lazy(() => import('./screens/Overview/LawAndOrderOverview'))
const CourtCaseDetail = lazy(() =>
  import('./screens/CourtCaseDetail/CourtCaseDetail'),
)
const Subpoena = lazy(() => import('./screens/Subpoena/Subpoena'))

export const lawAndOrderModule: PortalModule = {
  name: m.lawAndOrder,
  routes: ({ userInfo }) => [
    {
      name: m.lawAndOrder,
      path: LawAndOrderPaths.Root,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <Navigate to={LawAndOrderPaths.Overview} replace />,
    },
    {
      name: m.overview,
      path: LawAndOrderPaths.Overview,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <Overview/>
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <Overview defaultTab={DOMSMALARADUNEYTID_SLUG} />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCaseDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <CourtCaseDetail />,
    },
    {
      name: m.subpoena,
      path: LawAndOrderPaths.SubpoenaDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <Subpoena />,
    },
    {
      name: m.policeCases,
      path: LawAndOrderPaths.PoliceCases,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element:<Overview defaultTab={RIKISLOGREGLUSTJORI_SLUG} />,
    },
    {
      name: m.policeCases,
      path: LawAndOrderPaths.PoliceCasesDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <PoliceCaseDetail />,
    },
  ],
}
