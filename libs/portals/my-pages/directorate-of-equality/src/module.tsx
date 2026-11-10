import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { Features } from '@island.is/react/feature-flags'

import { DirectorateOfEqualityPaths } from './lib/paths'

const Submissions = lazy(() => import('./screens/Submissions/Submissions'))
const EqualityPlanDetail = lazy(() =>
  import('./screens/EqualityPlanDetail/EqualityPlanDetail'),
)
const ReportDetail = lazy(() => import('./screens/ReportDetail/ReportDetail'))
const ApiKeys = lazy(() => import('./screens/ApiKeys/ApiKeys'))

export const directorateOfEqualityModule: PortalModule = {
  name: m.equality,
  featureFlag: Features.isServicePortalEqualityPageEnabled,
  enabled: ({ isCompany }) => isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.equality,
      path: DirectorateOfEqualityPaths.Root,
      enabled: true,
      element: <Navigate to={DirectorateOfEqualityPaths.Plans} replace />,
    },
    {
      name: m.equalitySubmissions,
      path: DirectorateOfEqualityPaths.Submissions,
      enabled: true,
      element: <Navigate to={DirectorateOfEqualityPaths.Plans} replace />,
    },
    {
      name: m.equalityPlans,
      path: DirectorateOfEqualityPaths.Plans,
      enabled: true,
      element: <Submissions />,
    },
    {
      name: m.equalityPlan,
      path: DirectorateOfEqualityPaths.PlanDetail,
      enabled: userInfo.scopes.includes(ApiScope.directorateOfEquality),
      requiredScopes: [ApiScope.directorateOfEquality],
      element: <EqualityPlanDetail />,
    },
    {
      name: m.equalityReports,
      path: DirectorateOfEqualityPaths.Reports,
      enabled: true,
      element: <Submissions />,
    },
    {
      name: m.equalityReport,
      path: DirectorateOfEqualityPaths.ReportDetail,
      enabled: userInfo.scopes.includes(ApiScope.directorateOfEqualitySalary),
      requiredScopes: [ApiScope.directorateOfEqualitySalary],
      element: <ReportDetail />,
    },
    {
      name: m.equalityApiKeys,
      path: DirectorateOfEqualityPaths.ApiKeys,
      // TODO: restore together with ApiScope.directorateOfEqualityApiKeys in servicePortalScopes
      // enabled: userInfo.scopes.includes(ApiScope.directorateOfEqualityApiKeys),
      // requiredScopes: [ApiScope.directorateOfEqualityApiKeys],
      enabled: true,
      element: <ApiKeys />,
    },
  ],
}
