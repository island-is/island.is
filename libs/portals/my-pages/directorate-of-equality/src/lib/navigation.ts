import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'

import { DirectorateOfEqualityPaths } from './paths'

export const directorateOfEqualityNavigation: PortalNavigationItem = {
  name: m.equality,
  description: m.equalityDescription,
  path: DirectorateOfEqualityPaths.Root,
  icon: { icon: 'people' },
  children: [
    {
      name: m.equalitySubmissions,
      path: DirectorateOfEqualityPaths.Submissions,
      searchTags: [m.equalityPlans, m.equalityReports],
      children: [
        {
          name: m.equalityPlans,
          path: DirectorateOfEqualityPaths.Plans,
          navHide: true,
        },
        {
          name: m.equalityReports,
          path: DirectorateOfEqualityPaths.Reports,
          navHide: true,
        },
        {
          name: m.equalityPlan,
          path: DirectorateOfEqualityPaths.PlanDetail,
          navHide: true,
          searchHide: true,
        },
        {
          name: m.equalityReport,
          path: DirectorateOfEqualityPaths.ReportDetail,
          navHide: true,
          searchHide: true,
        },
      ],
    },
    {
      name: m.equalityApiKeys,
      path: DirectorateOfEqualityPaths.ApiKeys,
    },
  ],
}
