import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { Features } from '@island.is/react/feature-flags'
import { lazy } from 'react'
import { EstatesPaths } from './lib/paths'

const EstatesOverview = lazy(() => import('./screens/Overview/EstatesOverview'))
const EstateDetail = lazy(() => import('./screens/Detail/EstateDetail'))
const EstateFiles = lazy(() => import('./screens/Files/EstateFiles'))

export const estatesModule: PortalModule = {
  name: m.myEstates,
  featureFlag: Features.isServicePortalEstatesEnabled,
  routes: ({ userInfo }) => [
    {
      name: m.myEstates,
      path: EstatesPaths.EstatesRoot,
      // TODO: Switch to ApiScope.estates once the scope is provisioned
      enabled: userInfo.scopes.includes(ApiScope.internal),
      element: <EstatesOverview />,
    },
    {
      name: m.myEstates,
      path: EstatesPaths.EstatesDetail,
      // TODO: Switch to ApiScope.estates once the scope is provisioned
      enabled: userInfo.scopes.includes(ApiScope.internal),
      element: <EstateDetail />,
    },
    {
      name: m.myEstates,
      path: EstatesPaths.EstatesFiles,
      // TODO: Switch to ApiScope.estates once the scope is provisioned
      enabled: userInfo.scopes.includes(ApiScope.internal),
      element: <EstateFiles />,
    },
  ],
}
