import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { LawAndOrderPaths } from './paths'

export const lawAndOrderNavigation: PortalNavigationItem = {
  name: m.lawAndOrder,
  path: LawAndOrderPaths.LawAndOrderRoot,
  icon: {
    icon: 'attach',
  },
  children: [
    {
      name: m.overview,
      path: LawAndOrderPaths.LawAndOrderRoot,
    },
  ],
}
