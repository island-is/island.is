import { delegationScopes } from '@island.is/auth/scopes'
import { lazy } from 'react'
import {
  m as coreMessages,
  PortalModule,
  PortalRoute,
} from '@island.is/portals/core'
import { DelegationPaths } from './lib/paths'
import { m } from './lib/messages'
import { accessControlLoader } from './screens/AccessControl.loader'
import { GrantAccessScopes } from './screens/GrantAccessScopes/GrantAccessScopes'

const AccessControl = lazy(() => import('./screens/AccessControl'))
const AccessControlNew = lazy(() => import('./screens/AccessControlNew'))
const GrantAccess = lazy(() => import('./screens/GrantAccess/GrantAccess'))
const GrantAccessNew = lazy(() =>
  import('./screens/GrantAccess/GrantAccessNew'),
)
// const GrantAccessNew = lazy(() =>
//   import('./screens/GrantAccessNew/GrantAccessNew'),
// )
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
        loader: accessControlLoader('umbod')(props),
      },
      {
        ...commonProps,
        path: DelegationPaths.DelegationsIncoming,
        loader: accessControlLoader('umbod')(props),
      },
      {
        name: m.accessControlNew,
        path: DelegationPaths.DelegationsNew,
        navHide: false,
        enabled: hasAccess,
        element: <AccessControlNew />,
        loader: accessControlLoader('umbod-nytt')(props),
      },
      {
        name: coreMessages.accessControlGrant,
        path: DelegationPaths.DelegationsGrant,
        element: <GrantAccess />,
        loader: accessControlLoader('umbod/veita')(props),
      },
      {
        name: m.accessScopes,
        path: DelegationPaths.DelegationsGrantScopes,
        element: <GrantAccessScopes />,
        loader: accessControlLoader('umbod/veita-nytt')(props),
      },
      {
        name: coreMessages.accessControlAccess,
        path: DelegationPaths.DelegationAccess,
        element: <AccessOutgoing />,
        loader: accessControlLoader('umbod/:delegationId')(props),
      },
      {
        name: m.serviceCategories,
        path: DelegationPaths.ServiceCategories,
        navHide: !hasAccess,
        enabled: hasAccess,
        element: <ServiceCategories />,
        loader: accessControlLoader('umbod/thjonustuflokkar')(props),
      },
      {
        name: m.grantAccessNewTitle,
        path: DelegationPaths.DelegationsGrantNew,
        navHide: !hasAccess,
        enabled: hasAccess,
        element: <GrantAccessNew />,
        loader: accessControlLoader('umbod/veita-nytt')(props),
      },
    ]

    return routes
  },
}
