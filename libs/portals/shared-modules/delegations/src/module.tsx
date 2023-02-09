import { delegationScopes } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { DelegationPaths } from './lib/paths'
import { m } from './lib/messages'

const AccessControl = lazy(() => import('./screens/AccessControl'))
const GrantAccess = lazy(() => import('./screens/GrantAccess/GrantAccess'))
const AccessOutgoing = lazy(() =>
  import('./screens/AccessOutgoing/AccessOutgoing'),
)

export const delegationsModule: PortalModule = {
  name: m.accessControl,
  enabled({ userInfo }) {
    return delegationScopes.some((scope) => userInfo.scopes.includes(scope))
  },
  routes(props) {
    const { userInfo } = props

    const hasAccess = delegationScopes.some((scope) =>
      userInfo.scopes.includes(scope),
    )
    const commonProps = {
      name: m.accessControlDelegations,
      navHide: !hasAccess,
      element: <AccessControl />,
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
        element: <GrantAccess />,
      },
      {
        name: m.accessControlAccess,
        path: DelegationPaths.DelegationAccess,
        element: <AccessOutgoing />,
      },
    ]

    return routes
  },
}
