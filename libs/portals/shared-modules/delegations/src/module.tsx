import { delegationScopes } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Features } from '@island.is/feature-flags'

import {
  PortalModule,
  PortalRoute,
  SubNavigation,
} from '@island.is/portals/core'
import { DelegationPaths } from './lib/paths'
import { m } from './lib/messages'
import { delegationsNavigation } from './lib/navgation'

export const delegationsModule: PortalModule = {
  name: m.accessControl,
  featureFlag: Features.outgoingDelegationsV2,
  widgets: () => [],
  enabled({ userInfo }) {
    return delegationScopes.some((scope) => userInfo.scopes.includes(scope))
  },
  layout: 'full',
  moduleLayoutWrapper({ children, portalType }) {
    return (
      <div style={{ display: 'flex' }}>
        {portalType === 'admin' && (
          <SubNavigation navigation={delegationsNavigation} />
        )}
        {children}
      </div>
    )
  },
  routes({ userInfo }) {
    const hasAccess = delegationScopes.some((scope) =>
      userInfo.scopes.includes(scope),
    )
    const commonProps = {
      name: m.accessControlDelegations,
      path: DelegationPaths.Delegations,
      navHide: !hasAccess,
      render: () => lazy(() => import('./screens/AccessControl')),
    }

    const routes: PortalRoute[] = [
      {
        ...commonProps,
        path: DelegationPaths.Delegations,
      },
      {
        ...commonProps,
        path: DelegationPaths.DelegationsIncoming,
      },
      {
        name: m.accessControlGrant,
        path: DelegationPaths.DelegationsGrant,
        render: () => lazy(() => import('./screens/GrantAccess/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: DelegationPaths.DelegationAccess,
        render: () =>
          lazy(() => import('./screens/AccessOutgoing/AccessOutgoing')),
      },
    ]

    return routes
  },
}
