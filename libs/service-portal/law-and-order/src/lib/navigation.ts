import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { LawAndOrderPaths } from './paths'

export const lawAndOrderNavigation: PortalNavigationItem = {
  name: m.lawAndOrder,
  description: m.lawAndOrderDashboard,
  path: LawAndOrderPaths.Root,
  icon: {
    icon: 'attach',
  },
  children: [
    {
      name: m.overview,
      path: LawAndOrderPaths.Overview,
    },
    {
      name: m.courtCases,
      path: LawAndOrderPaths.CourtCases,
      children: [
        {
          name: m.courtCases,
          path: LawAndOrderPaths.CourtCaseDetail,
          breadcrumbHide: true,
          navHide: true,
          children: [
            {
              name: m.subpeona,
              path: LawAndOrderPaths.SubpeonaDetail,
              navHide: true,
            },
          ],
        },
      ],
    },
  ],
}
