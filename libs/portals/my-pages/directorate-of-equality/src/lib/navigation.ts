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
      children: [
        { name: m.equalityPlans, path: DirectorateOfEqualityPaths.Plans },
        { name: m.equalityReports, path: DirectorateOfEqualityPaths.Reports },
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
  ],
}
