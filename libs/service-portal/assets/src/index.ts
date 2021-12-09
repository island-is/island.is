import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalRoute,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

const assetsModule: ServicePortalModule = {
  name: 'Eignir',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.realEstate,
        path: ServicePortalPath.AssetsRoot,
        enabled: userInfo.scopes.includes(ApiScope.assets),
        render: () =>
          lazy(() => import('./screens/AssetsOverview/AssetsOverview')),
      },
      {
        name: m.detailInfo,
        path: ServicePortalPath.AssetsRealEstateDetail,
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

export { assetsModule }
