import { PortalModule } from '@island.is/portals/core'
import { LawAndOrderPaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'
import LawAndOrderOverview from './screens/LawAndOrderOverview'
import { m } from '@island.is/service-portal/core'

export const lawAndOrderModule: PortalModule = {
  name: m.lawAndOrder,
  routes: ({ userInfo }) => [
    {
      name: m.lawAndOrder,
      path: LawAndOrderPaths.LawAndOrderRoot,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <Navigate to={LawAndOrderPaths.LawAndOrderOverview} replace />,
    },
    {
      name: m.overview,
      path: LawAndOrderPaths.LawAndOrderOverview,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      element: <LawAndOrderOverview />,
    },
  ],
}
