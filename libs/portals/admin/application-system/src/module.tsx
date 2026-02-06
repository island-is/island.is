import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule, PortalModuleRoutesProps } from '@island.is/portals/core'
import React, { lazy } from 'react'
import { m } from './lib/messages'
import { ApplicationSystemPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

const Root = lazy(() => import('./screens/Root/Root'))

const allowedScopes: string[] = [
  AdminPortalScope.applicationSystemAdmin,
  AdminPortalScope.applicationSystemInstitution,
]
const getRoot = ({ userInfo }: PortalModuleRoutesProps): React.ReactNode => {
  const isSuperAdmin = userInfo.scopes.includes(
    AdminPortalScope.applicationSystemAdmin,
  )
  return <Root isSuperAdmin={isSuperAdmin} />
}

export const applicationSystemAdminModule: PortalModule = {
  name: m.applicationSystem,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => [
    {
      name: m.overview,
      path: ApplicationSystemPaths.Root,
      element: getRoot(props),
      children: [
        {
          name: 'index',
          path: ApplicationSystemPaths.Root,
          index: true,
          element: <Navigate to={ApplicationSystemPaths.Overview} />,
        },
      ],
    },
  ],
}
