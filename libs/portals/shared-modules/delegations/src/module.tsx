import { delegationScopes } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { m as coreMessages, PortalModule, PortalRoute } from '@island.is/portals/core'
import { DelegationPaths } from './lib/paths'
import { m } from './lib/messages'

const AccessControl = lazy(() => import('./screens/AccessControl'))
const AccessControlNew = lazy(() => import('./screens/AccessControlNew'))
const GrantAccess = lazy(() => import('./screens/GrantAccess/GrantAccess'))
const GrantAccessNew = lazy(() => import('./screens/GrantAccessNew/GrantAccessNew'))
const AccessOutgoing = lazy(() =>
  import('./screens/AccessOutgoing/AccessOutgoing'),
)
const ServiceCategories = lazy(() =>
  import('./screens/ServiceCategories/ServiceCategories'),
)

export const delegationsModule: PortalModule = {
  name: coreMessages.accessControl,
  enabled({ userInfo }) {
    return delegationScopes.some((scope) => userInfo.scopes.includes(scope))
  },
  routes(props) {
    const { userInfo } = props

    const hasAccess = delegationScopes.some((scope) =>
      userInfo.scopes.includes(scope),
    )
    const commonProps = {
      name: coreMessages.accessControlDelegations,
      navHide: !hasAccess,
      enabled: hasAccess,
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
        name: m.accessControlNew,
        path: DelegationPaths.DelegationsNew,
        navHide: false,
        enabled: hasAccess,
        element: <AccessControlNew />,
      },
      {
        name: coreMessages.accessControlGrant,
        path: DelegationPaths.DelegationsGrant,
        element: <GrantAccess />,
      },
      {
        name: coreMessages.accessControlAccess,
        path: DelegationPaths.DelegationAccess,
        element: <AccessOutgoing />,
      },
      {
        name: m.serviceCategories,
        path: DelegationPaths.ServiceCategories,
        navHide: !hasAccess,
        enabled: hasAccess,
        element: <ServiceCategories />,
      },
      {
        name: m.grantAccessNewTitle,
        path: DelegationPaths.DelegationsGrantNew,
        navHide: !hasAccess,
        enabled: hasAccess,
        element: <GrantAccessNew />,
      },
    ]

    return routes
  },
}
