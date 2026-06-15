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
      enabled: userInfo.scopes.includes(ApiScope.estates),
      element: <EstatesOverview />,
    },
    {
      name: m.estatesDetail,
      path: EstatesPaths.EstatesDetail,
      enabled: userInfo.scopes.includes(ApiScope.estates),
      element: <EstateDetail />,
    },
    {
      name: m.estatesDetail,
      path: EstatesPaths.EstatesFiles,
      enabled: userInfo.scopes.includes(ApiScope.estates),
      element: <EstateFiles />,
    },
  ],
}
