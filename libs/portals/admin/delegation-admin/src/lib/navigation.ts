import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { DelegationAdminPaths } from './paths'

export const delegationAdminNav: PortalNavigationItem = {
  name: m.delegationAdmin,
  icon: {
    icon: 'fileTrayFull',
  },
  path: DelegationAdminPaths.Root,
  description: m.delegationAdminDescription,
  activeIfExact: true,
  children: [
    {
      name: m.delegationAdmin,
      path: DelegationAdminPaths.DelegationAdmin,
      activeIfExact: true,
      navHide: true,
    },
  ],
}
