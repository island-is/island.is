import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { DelegationAdminPaths } from './paths'

export const delegationAdminNav: PortalNavigationItem = {
  name: m.delegationAdmin,
  path: DelegationAdminPaths.delegationAdmin,
  description: m.delegationAdminDescription,
  activeIfExact: true,
}
