import { PortalModule } from '@island.is/portals/core'
import { LawAndOrderPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'
import { m } from '@island.is/portals/my-pages/core'
import { lazy } from 'react'
import PoliceCases from './screens/PoliceCases/PoliceCases'
import PoliceCaseDetail from './screens/PoliceCaseDetail/PoliceCaseDetail'

const CourtCases = lazy(() => import('./screens/CourtCases/CourtCases'))
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
      element: <Navigate to={LawAndOrderPaths.CourtCases} replace />,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <CourtCases />,
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
      element: <PoliceCases />,
    },
    {
      name: m.policeCases,
      path: LawAndOrderPaths.PoliceCasesDetail,
      enabled: userInfo.scopes.includes(ApiScope.lawAndOrder),
      element: <PoliceCaseDetail />,
    },
  ],
}
