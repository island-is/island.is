import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule, PortalModuleRoutesProps } from '@island.is/portals/core'
import React, { lazy } from 'react'
import { m } from './lib/messages'
import { ApplicationSystemPaths } from './lib/paths'

const Overview = lazy(() => import('./screens/Overview/Overview'))
const InstitutionOverview = lazy(() =>
  import('./screens/Overview/InstitutionOverview'),
)

const allowedScopes: string[] = [
  AdminPortalScope.applicationSystemAdmin,
  AdminPortalScope.applicationSystemInstitution,
]
const getScreen = ({ userInfo }: PortalModuleRoutesProps): React.ReactNode => {
  if (userInfo.scope?.includes(AdminPortalScope.applicationSystemInstitution)) {
    return <InstitutionOverview />
  }
  return <Overview />
}

export const applicationSystemAdminModule: PortalModule = {
  name: m.applicationSystem,
  layout: 'full',
  enabled: ({ userInfo }) => {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes: (props) => [
    {
      name: m.overview,
      path: ApplicationSystemPaths.Root,
      element: getScreen(props),
    },
  ],
}
