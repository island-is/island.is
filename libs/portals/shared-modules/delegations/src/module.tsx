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

const ChildRouteLazy = lazy(() => import('./screens/ChildRouteLazy'))

const ChildRouteWithError = (props: any) => (
  <div>{props.test.jon}Grant Access child route with Error</div>
)

export const delegationsModule: PortalModule = {
  name: m.accessControl,
  enabled({ userInfo }) {
    return delegationScopes.some((scope) => userInfo.scopes.includes(scope))
  },
  routes({ userInfo }) {
    const hasAccess = delegationScopes.some((scope) =>
      userInfo.scopes.includes(scope),
    )
    const commonProps = {
      name: m.accessControlDelegations,
      path: DelegationPaths.Delegations,
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
        element: <GrantAccess userInfo={userInfo} />,
        children: [
          {
            name: 'Grant Access child route',
            path: '/adgangsstyring/umbod/veita/child',
            element: <ChildRouteLazy />,
            loader: async () => {
              const res = await fetch(
                'https://raw.githubusercontent.com/theapache64/top250/master/top250_min.json',
              )

              return res.json()
            },
          },
          {
            name: 'Grant Access child route with error',
            path: '/adgangsstyring/umbod/veita/error',
            element: <ChildRouteWithError />,
          },
          {
            name: 'Grant Access child route with own error element',
            path: '/adgangsstyring/umbod/veita/ownerror',
            element: <ChildRouteWithError />,
            errorElement: <div>Own error element</div>,
          },
        ],
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
