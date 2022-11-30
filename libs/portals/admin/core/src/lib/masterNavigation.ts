import {
  m as coreMessages,
  PortalNavigationItem,
  PortalPaths,
} from '@island.is/portals/core'
import {
  DelegationPaths,
  m as delegationsMessages,
} from '@island.is/portals/shared-modules/delegations'

export const adminMasterNavigation: PortalNavigationItem[] = [
  {
    name: coreMessages.overview,
    systemRoute: true,
    path: PortalPaths.Root,
    icon: {
      icon: 'home',
    },
    children: [
      // Aðgangsstýring umboð
      {
        name: delegationsMessages.accessControl,
        path: DelegationPaths.Delegations,
        icon: {
          icon: 'people',
        },
        description: delegationsMessages.accessControlDescription,
        children: [
          {
            name: delegationsMessages.accessControlDelegations,
            path: DelegationPaths.Delegations,
            navHide: true,
            children: [
              {
                name: delegationsMessages.accessControlGrant,
                path: DelegationPaths.DelegationsGrant,
                navHide: true,
              },
            ],
          },
          {
            name: delegationsMessages.accessControlDelegationsIncoming,
            path: DelegationPaths.DelegationsIncoming,
            navHide: true,
            breadcrumbHide: true,
          },
          {
            name: delegationsMessages.accessControlAccess,
            path: DelegationPaths.DelegationAccess,
            navHide: true,
          },
        ],
      },
    ],
  },
]
