import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { HealthPaths } from './lib/paths'
import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/feature-flags'

const HealthOverview = lazy(() =>
  import('./screens/HealthOverview/HealthOverview'),
)
const Therapies = lazy(() => import('./screens/Therapies/Therapies'))
const AidsAndNutrition = lazy(() =>
  import('./screens/AidsAndNutrition/AidsAndNutrition'),
)

export const healthModule: PortalModule = {
  name: 'Heilsa',
  featureFlag: Features.servicePortalHealthRightsModule,
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Heilsa',
      path: HealthPaths.HealthRoot,
      enabled: userInfo.scopes.includes(ApiScope.rightsPortal),
      element: <HealthOverview />,
    },
    {
      name: 'Þjálfun',
      path: HealthPaths.HealthTherapies,
      enabled: userInfo.scopes.includes(ApiScope.rightsPortal),
      element: <Therapies />,
    },
    {
      name: 'Hjálpartæki og næring',
      path: HealthPaths.HealthAidsAndNutrition,
      enabled: userInfo.scopes.includes(ApiScope.rightsPortal),
      element: <AidsAndNutrition />,
    },
  ],
}
