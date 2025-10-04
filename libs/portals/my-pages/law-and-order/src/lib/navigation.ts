import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { LawAndOrderPaths } from './paths'

export const lawAndOrderNavigation: PortalNavigationItem = {
  name: m.lawAndOrder,
  description: m.lawAndOrderDashboard,
  intro: m.lawAndOrderDescription,
  searchTags: [
    s.lawAndOrderVerdict,
    s.lawAndOrderLaw,
    s.lawAndOrderCase,
    s.lawAndOrderOrder,
  ],
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
      name: m.courtCases,
      description: m.myCourtCasesIntro,
      path: LawAndOrderPaths.CourtCases,
      children: [
        {
          name: m.courtCases,
          path: LawAndOrderPaths.CourtCaseDetail,
          navHide: true,
          breadcrumbHide: true,
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
    {
      name: m.policeCases,
      description: m.myPoliceCasesIntro,
      path: LawAndOrderPaths.PoliceCases,
      children: [
        {
          name: m.policeCases,
          breadcrumbHide: true,
          path: LawAndOrderPaths.PoliceCasesDetail,
          navHide: true,
        },
      ],
    },
  ],
}
