import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { m } from './lib/messages'
import { ServiceDeskPaths } from './lib/paths'
import { CompaniesAction } from './screens/Companies/Companies.action'
import { procurersLoader } from './screens/Procurers/Procurers.loader'

const Companies = lazy(() => import('./screens/Companies/Companies'))
const Procures = lazy(() => import('./screens/Procurers/Procurers'))

const Root = lazy(() => import('./screens/Root/Root'))

const Users = <div>Users</div>
const User = <div>User details</div>

export const serviceDeskModule: PortalModule = {
  name: m.serviceDesk,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.serviceDesk),
  routes: (props) => [
    {
      name: m.serviceDesk,
      path: ServiceDeskPaths.Root,
      element: <Root />,
      children: [
        {
          name: m.serviceDesk,
          path: ServiceDeskPaths.Companies,
          element: <Companies />,
          action: CompaniesAction(props),
        },
        {
          name: m.procures,
          path: ServiceDeskPaths.Company,
          element: <Procures />,
          loader: procurersLoader(props),
          navHide: true,
        },
        {
          name: m.users,
          path: ServiceDeskPaths.Users,
          element: Users,
        },
        {
          name: m.user,
          path: ServiceDeskPaths.User,
          element: User,
          navHide: true,
        },
      ],
    },
  ],
}
