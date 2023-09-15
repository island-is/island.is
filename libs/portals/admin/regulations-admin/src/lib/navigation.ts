import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { RegulationsAdminPaths } from './paths'

export const regulationAdminNavigation: PortalNavigationItem = {
  name: m.regulationAdmin,
  path: RegulationsAdminPaths.RegulationsAdminRoot,
  description: m.regulationAdminDescription,
  icon: {
    type: 'outline',
    icon: 'settings',
  },
}
