import {
  PortalNavigationItem,
  m as coreMessages,
} from '@island.is/portals/core'
import { DelegationPaths } from './paths'
import { m } from './messages'

export const delegationsNavigationChildren: PortalNavigationItem[] = [
  {
    name: coreMessages.accessControlDelegations,
    path: DelegationPaths.Delegations,
    navHide: false,
    breadcrumbHide: true,
    children: [
      {
        name: coreMessages.accessControlGrant,
        path: DelegationPaths.DelegationsGrant,
        navHide: true,
      },
    ],
  },
  {
    name: m.accessControlNew,
    path: DelegationPaths.DelegationsNew,
    navHide: false,
    breadcrumbHide: true,
  },
  {
    name: coreMessages.accessControlDelegationsIncoming,
    path: DelegationPaths.DelegationsIncoming,
    navHide: true,
    breadcrumbHide: true,
  },
  {
    name: coreMessages.accessControlAccess,
    path: DelegationPaths.DelegationAccess,
    navHide: true,
  },
  {
    name: m.whichDelegationsSuit,
    path: DelegationPaths.ServiceCategories,
    navHide: false,
    breadcrumbHide: false,
  },
  {
    name: m.grantAccessNewTitle,
    path: DelegationPaths.DelegationsGrantNew,
    navHide: false,
    breadcrumbHide: false,
  },
]

export const delegationsNavigation: PortalNavigationItem = {
  name: coreMessages.digitalDelegations,
  path: DelegationPaths.Delegations,
  icon: {
    icon: 'lockClosed',
  },
  description: coreMessages.accessControlDescription,
  children: delegationsNavigationChildren,
}
