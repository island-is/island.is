import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { IDSAdminPaths } from './paths'

export const idsAdminNavigation: PortalNavigationItem = {
  name: m.idsAdmin,
  path: IDSAdminPaths.IDSAdmin,
  icon: {
    icon: 'settings',
  },
  description: m.idsAdmin,
}
