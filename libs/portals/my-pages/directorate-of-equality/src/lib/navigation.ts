import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'

import { DirectorateOfEqualityPaths } from './paths'

export const directorateOfEqualityNavigation: PortalNavigationItem = {
  name: m.equality,
  description: m.equalityDescription,
  path: DirectorateOfEqualityPaths.Root,
  icon: { icon: 'scale' },
  children: [
    {
      name: m.equalityMyStatus,
      path: DirectorateOfEqualityPaths.Status,
    },
    {
      name: m.equalityPlans,
      path: DirectorateOfEqualityPaths.Plans,
      children: [
        {
          name: m.equalityPlan,
          path: DirectorateOfEqualityPaths.PlanDetail,
          navHide: true,
          searchHide: true,
        },
      ],
    },
    {
      name: m.equalityReportsList,
      path: DirectorateOfEqualityPaths.Reports,
      children: [
        {
          name: m.equalityReport,
          path: DirectorateOfEqualityPaths.ReportDetail,
          navHide: true,
          searchHide: true,
        },
      ],
    },
    {
      name: m.equalityServiceProviders,
      path: DirectorateOfEqualityPaths.ServiceProviders,
      children: [
        {
          name: m.equalityServiceProvider,
          path: DirectorateOfEqualityPaths.ServiceProviderDetail,
          navHide: true,
          searchHide: true,
        },
        {
          name: m.equalityGrantServiceProvider,
          path: DirectorateOfEqualityPaths.GrantServiceProvider,
          navHide: true,
          searchHide: true,
        },
      ],
    },
    {
      name: m.equalityApiKeys,
      path: DirectorateOfEqualityPaths.ApiKeys,
      children: [
        {
          name: m.equalityApiKey,
          path: DirectorateOfEqualityPaths.ApiKeyDetail,
          navHide: true,
          searchHide: true,
        },
        {
          name: m.equalityCreateApiKey,
          path: DirectorateOfEqualityPaths.CreateApiKey,
          navHide: true,
          searchHide: true,
        },
      ],
    },
  ],
}
