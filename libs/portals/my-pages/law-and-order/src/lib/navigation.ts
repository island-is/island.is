import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { LawAndOrderPaths } from './paths'

export const lawAndOrderNavigation: PortalNavigationItem = {
  name: m.lawAndOrder,
  description: m.lawAndOrderDashboard,
  intro: m.lawAndOrderDescription,
  path: LawAndOrderPaths.Root,
  icon: {
    icon: 'gavel',
  },
  children: [
    {
      name: m.overview,
      searchHide: true,
      path: LawAndOrderPaths.Overview,
    },
    {
      name: m.myCourtCases,
      description: m.myCourtCasesIntro,
      path: LawAndOrderPaths.CourtCases,
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
