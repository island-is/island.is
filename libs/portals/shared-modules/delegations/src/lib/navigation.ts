import { PortalNavigationItem } from '@island.is/portals/core'
import { DelegationPaths } from './paths'
import { m } from './messages'

export const delegationsNavigation: PortalNavigationItem = {
  name: m.accessControl,
  path: DelegationPaths.Delegations,
  icon: {
    icon: 'lockClosed',
  },
  description: m.accessControlDescription,
  children: [
    {
      name: m.accessControlDelegationsOutgoingLong,
      path: DelegationPaths.Delegations,
      children: [
        {
          name: m.accessControlGrant,
          path: DelegationPaths.DelegationsGrant,
          navHide: true,
        },
      ],
    },
    {
      name: m.accessControlDelegationsIncomingLong,
      path: DelegationPaths.DelegationsIncoming,
      breadcrumbHide: true,
    },
    {
      name: m.accessControlAccess,
      path: DelegationPaths.DelegationAccess,
      navHide: true,
    },
  ],
  isKeyitem: true,
}
