import { lazy } from 'react'
import {
  ServicePortalModule,
  ServicePortalRoute,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const assetsModule: ServicePortalModule = {
  name: 'Eignir',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.realEstate,
        path: ServicePortalPath.AssetsRoot,
        render: () =>
          lazy(() => import('./screens/AssetsOverview/AssetsOverview')),
      },
      {
        name: m.detailInfo,
        path: ServicePortalPath.AssetsRealEstateDetail,
        render: () =>
          lazy(() =>
            import('./screens/RealEstateAssetDetail/RealEstateAssetDetail'),
          ),
      },
    ]

    return routes
  },
}
