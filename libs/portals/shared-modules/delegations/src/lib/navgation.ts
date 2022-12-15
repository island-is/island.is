import { PortalNavigationItem } from '@island.is/portals/core'
import { DelegationPaths } from './paths'
import { m } from './messages'

export const delegationsNavigation: PortalNavigationItem = {
  name: m.accessControl,
  path: DelegationPaths.Delegations,
  icon: {
    icon: 'people',
  },
  description: m.accessControlDescription,
  children: [
    {
      name: m.accessControlDelegations,
      path: DelegationPaths.Delegations,
      navHide: false, //true,
      children: [
        {
          name: m.accessControlGrant,
          path: DelegationPaths.DelegationsGrant,
          navHide: false, // true,
        },
      ],
    },
    {
      name: m.accessControlDelegationsIncoming,
      path: DelegationPaths.DelegationsIncoming,
      navHide: false, // false,
      breadcrumbHide: true,
    },
    {
      name: m.accessControlAccess,
      path: DelegationPaths.DelegationAccess,
      navHide: false, //true,
    },
  ],
}
