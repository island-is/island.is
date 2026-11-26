import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { Features } from '@island.is/react/feature-flags'

import { RedirectWithId } from './components/RedirectWithId/RedirectWithId'
import {
  DirectorateOfEqualityPaths,
  LegacyDirectorateOfEqualityPaths,
} from './lib/paths'

const Status = lazy(() => import('./screens/Status/Status'))
const EqualityPlans = lazy(() => import('./screens/EqualityPlans/EqualityPlans'))
const EqualityPlanDetail = lazy(() =>
  import('./screens/EqualityPlanDetail/EqualityPlanDetail'),
)
const Reports = lazy(() => import('./screens/Reports/Reports'))
const ReportDetail = lazy(() => import('./screens/ReportDetail/ReportDetail'))
const ServiceProviders = lazy(() =>
  import('./screens/ServiceProviders/ServiceProviders'),
)
const ServiceProviderDetail = lazy(() =>
  import('./screens/ServiceProviderDetail/ServiceProviderDetail'),
)
const GrantServiceProvider = lazy(() =>
  import('./screens/GrantServiceProvider/GrantServiceProvider'),
)
const ApiKeys = lazy(() => import('./screens/ApiKeys/ApiKeys'))
const ApiKeyDetail = lazy(() => import('./screens/ApiKeyDetail/ApiKeyDetail'))
const CreateApiKey = lazy(() => import('./screens/CreateApiKey/CreateApiKey'))

export const directorateOfEqualityModule: PortalModule = {
  name: m.equality,
  featureFlag: Features.isServicePortalEqualityPageEnabled,
  enabled: ({ isCompany }) => isCompany,
  routes: ({ userInfo }) => {
    const access = (...scopes: ApiScope[]) => {
      const requiredScopes = [ApiScope.directorateOfEqualityCompany, ...scopes]
      return {
        enabled: requiredScopes.every((scope) =>
          userInfo.scopes.includes(scope),
        ),
        requiredScopes,
      }
    }

    return [
      {
        name: m.equality,
        path: DirectorateOfEqualityPaths.Root,
        ...access(),
        element: <Navigate to={DirectorateOfEqualityPaths.Status} replace />,
      },
      {
        name: m.equalityMyStatus,
        path: DirectorateOfEqualityPaths.Status,
        ...access(),
        element: <Status />,
      },
      {
        name: m.equalityPlans,
        path: DirectorateOfEqualityPaths.Plans,
        ...access(),
        element: <EqualityPlans />,
      },
      {
        name: m.equalityPlan,
        path: DirectorateOfEqualityPaths.PlanDetail,
        ...access(ApiScope.directorateOfEquality),
        element: <EqualityPlanDetail />,
      },
      {
        name: m.equalityReportsList,
        path: DirectorateOfEqualityPaths.Reports,
        ...access(),
        element: <Reports />,
      },
      {
        name: m.equalityReport,
        path: DirectorateOfEqualityPaths.ReportDetail,
        ...access(ApiScope.directorateOfEqualitySalary),
        element: <ReportDetail />,
      },
      {
        name: m.equalityServiceProviders,
        path: DirectorateOfEqualityPaths.ServiceProviders,
        ...access(),
        element: <ServiceProviders />,
      },
      {
        name: m.equalityGrantServiceProvider,
        path: DirectorateOfEqualityPaths.GrantServiceProvider,
        ...access(),
        element: <GrantServiceProvider />,
      },
      {
        name: m.equalityServiceProvider,
        path: DirectorateOfEqualityPaths.ServiceProviderDetail,
        ...access(),
        element: <ServiceProviderDetail />,
      },
      {
        name: m.equalityApiKeys,
        path: DirectorateOfEqualityPaths.ApiKeys,
        ...access(),
        element: <ApiKeys />,
      },
      {
        name: m.equalityCreateApiKey,
        path: DirectorateOfEqualityPaths.CreateApiKey,
        ...access(),
        element: <CreateApiKey />,
      },
      {
        name: m.equalityApiKey,
        path: DirectorateOfEqualityPaths.ApiKeyDetail,
        ...access(),
        element: <ApiKeyDetail />,
      },
      {
        name: m.equalityMyStatus,
        path: LegacyDirectorateOfEqualityPaths.Submissions,
        ...access(),
        element: <Navigate to={DirectorateOfEqualityPaths.Status} replace />,
      },
      {
        name: m.equalityPlans,
        path: LegacyDirectorateOfEqualityPaths.Plans,
        ...access(),
        element: <Navigate to={DirectorateOfEqualityPaths.Plans} replace />,
      },
      {
        name: m.equalityPlan,
        path: LegacyDirectorateOfEqualityPaths.PlanDetail,
        ...access(ApiScope.directorateOfEquality),
        element: <RedirectWithId to={DirectorateOfEqualityPaths.PlanDetail} />,
      },
      {
        name: m.equalityReportsList,
        path: LegacyDirectorateOfEqualityPaths.Reports,
        ...access(),
        element: <Navigate to={DirectorateOfEqualityPaths.Reports} replace />,
      },
      {
        name: m.equalityReport,
        path: LegacyDirectorateOfEqualityPaths.ReportDetail,
        ...access(ApiScope.directorateOfEqualitySalary),
        element: <RedirectWithId to={DirectorateOfEqualityPaths.ReportDetail} />,
      },
    ]
  },
}
