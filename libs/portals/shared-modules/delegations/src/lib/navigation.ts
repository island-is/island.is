import { PortalNavigationItem, m } from '@island.is/portals/core'
import { DelegationPaths } from './paths'

export const delegationsNavigationChildren: PortalNavigationItem[] = [
  {
    name: m.accessControlDelegations,
    path: DelegationPaths.Delegations,
    navHide: false,
    serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    breadcrumbHide: true,
    children: [
      {
        name: m.accessControlGrant,
        path: DelegationPaths.DelegationsGrant,
        navHide: true,
      },
    ],
  },
  {
    name: m.accessControlDelegationsIncoming,
    path: DelegationPaths.DelegationsIncoming,
    navHide: true,
    serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    breadcrumbHide: true,
  },
  {
    name: m.accessControlAccess,
    path: DelegationPaths.DelegationAccess,
    navHide: true,
    serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
  },
]

export const delegationsNavigation: PortalNavigationItem = {
  name: m.accessControl,
  path: DelegationPaths.Delegations,
  icon: {
    icon: 'lockClosed',
  },
  description: m.accessControlDescription,
  children: delegationsNavigationChildren,
  serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
  isKeyitem: true,
}
