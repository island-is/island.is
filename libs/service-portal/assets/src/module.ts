import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { AssetsPaths } from './lib/paths'

export const assetsModule: PortalModule = {
  name: 'Fasteignir',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: PortalRoute[] = [
      {
        name: m.realEstate,
        path: AssetsPaths.AssetsRoot,
        enabled: userInfo.scopes.includes(ApiScope.assets),
        render: () =>
          lazy(() => import('./screens/AssetsOverview/AssetsOverview')),
      },
      {
        name: m.detailInfo,
        path: AssetsPaths.AssetsRealEstateDetail,
        enabled: userInfo.scopes.includes(ApiScope.assets),
        render: () =>
          lazy(() =>
            import('./screens/RealEstateAssetDetail/RealEstateAssetDetail'),
          ),
      },
    ]

    return routes
  },
}
