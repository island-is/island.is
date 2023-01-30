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
  serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',

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
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
    {
      name: m.accessControlDelegationsIncomingLong,
      path: DelegationPaths.DelegationsIncoming,
      breadcrumbHide: true,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
    {
      name: m.accessControlAccess,
      path: DelegationPaths.DelegationAccess,
      navHide: true,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
  ],
  isKeyitem: true,
}
