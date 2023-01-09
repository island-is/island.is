import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { RegulationsAdminPaths } from './paths'

export const regulationAdminNavigation: PortalNavigationItem = {
  name: m.regulationAdmin,
  path: RegulationsAdminPaths.RegulationsAdminRoot,
  icon: {
    type: 'outline',
    icon: 'settings',
  },
}
