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
import { Features } from '@island.is/react/feature-flags'
import EditAccess from './screens/EditAccess.tsx/EditAccess'

const AccessControl = lazy(() => import('./screens/AccessControl'))
const AccessControlNew = lazy(() => import('./screens/AccessControlNew'))
const DelegationLayout = lazy(() => import('./screens/DelegationLayout'))
const GrantAccess = lazy(() => import('./screens/GrantAccess/GrantAccess'))
const GrantAccessNew = lazy(() =>
  import('./screens/GrantAccessNew/GrantAccessNew'),
)

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
  async routes(props) {
    const { userInfo, featureFlagClient } = props

    const useNewRoutes = await featureFlagClient.getValue(
      Features.useNewDelegationSystem,
      false,
      {
        id: userInfo.profile.nationalId,
        attributes: {},
      },
    )

    const hasAccess = delegationScopes.some((scope) =>
      userInfo.scopes.includes(scope),
    )
    const commonProps = {
      name: coreMessages.accessControlDelegations,
      navHide: !hasAccess,
      enabled: hasAccess,
      element: <AccessControl />,
    }

    const newRoutes: PortalRoute[] = [
      {
        name: m.digitalDelegations,
        path: DelegationPaths.DelegationsNew,
        enabled: hasAccess,
        element: <DelegationLayout />,
        children: [
          {
            name: m.digitalDelegations,
            navHide: false,
            enabled: hasAccess,
            path: DelegationPaths.DelegationsNew,
            element: <AccessControlNew />,
            loader: accessControlLoader('umbod')(props),
          },
          {
            name: m.grantAccessNewTitle,
            path: DelegationPaths.DelegationsGrantNew,
            navHide: true,
            enabled: hasAccess,
            element: <GrantAccessNew />,
            loader: accessControlLoader('umbod/veita')(props),
          },
          {
            name: m.editAccessTitle,
            path: DelegationPaths.DelegationsEdit,
            navHide: true,
            enabled: hasAccess,
            element: <EditAccess />,
            loader: accessControlLoader('umbod/breyta')(props),
          },
          {
            name: m.serviceCategories,
            path: DelegationPaths.ServiceCategories,
            navHide: true,
            enabled: hasAccess,
            element: <ServiceCategories />,
            loader: accessControlLoader('umbod/thjonustuflokkar')(props),
          },
        ],
      },
    ]

    const oldRoutes: PortalRoute[] = [
      {
        ...commonProps,
        path: DelegationPaths.Delegations,
      },
      {
        ...commonProps,
        path: DelegationPaths.DelegationsIncoming,
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
    ]

    return useNewRoutes ? newRoutes : oldRoutes
  },
}
