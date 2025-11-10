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
    s.police,
    s.policeShort,
    s.court,
    s.districtCourt,
    s.supremeCourt,
    s.courtOfAppeal,
    s.judgement,
    s.subpoena,
    s.indictment,
    s.judgementOfCase,
    s.defender,
    s.lawyer,
    s.appeal,
    s.plenarySession,
    s.ruling,
    s.fine,
    s.probation,
    s.reopening,
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
            {
              name: m.case,
              path: LawAndOrderPaths.VerdictDetail,
              navHide: true,
            },
          ],
        },
      ],
    },
  ],
}
