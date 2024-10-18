import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { LawAndOrderPaths } from './paths'

export const lawAndOrderNavigation: PortalNavigationItem = {
  name: m.lawAndOrder,
  description: m.lawAndOrderDashboard,
  path: LawAndOrderPaths.Root,
  icon: {
    icon: 'gavel',
  },
  children: [
    {
      name: m.overview,
      path: LawAndOrderPaths.Overview,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      breadcrumbHide: true,
      children: [
        {
          name: m.courtCases,
          path: LawAndOrderPaths.CourtCaseDetail,
          navHide: true,
          children: [
            {
              name: m.subpoena,
              path: LawAndOrderPaths.SubpoenaDetail,
              navHide: true,
            },
          ],
        },
      ],
    },
  ],
}
