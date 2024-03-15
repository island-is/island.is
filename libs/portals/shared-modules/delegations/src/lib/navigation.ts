import { PortalNavigationItem, m } from '@island.is/portals/core'
import { DelegationPaths } from './paths'

export const delegationsNavigationChildren: PortalNavigationItem[] = [
  {
    name: m.accessControlDelegations,
    path: DelegationPaths.Delegations,
    navHide: false,
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
    breadcrumbHide: true,
  },
  {
    name: m.accessControlAccess,
    path: DelegationPaths.DelegationAccess,
    navHide: true,
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
}
