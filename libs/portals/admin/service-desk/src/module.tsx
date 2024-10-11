import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { PortalModule } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { m } from './lib/messages'
import { ServiceDeskPaths } from './lib/paths'
import { CompaniesAction } from './screens/Companies/Companies.action'
import { procurersLoader } from './screens/Procurers/Procurers.loader'
import { UsersAction } from './screens/Users/Users.action'
import { userLoader } from './screens/User/User.loader'

const Companies = lazy(() => import('./screens/Companies/Companies'))
const Procures = lazy(() => import('./screens/Procurers/Procurers'))

const Root = lazy(() => import('./screens/Root/Root'))

const Users = lazy(() => import('./screens/Users/Users'))
const User = lazy(() => import('./screens/User/User'))

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
          name: 'index',
          path: ServiceDeskPaths.Root,
          index: true,
          element: <Navigate to={ServiceDeskPaths.Companies} />,
        },
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
          element: <Users />,
          action: UsersAction(props),
        },
        {
          name: m.user,
          path: ServiceDeskPaths.User,
          element: <User />,
          navHide: true,
          loader: userLoader(props),
        },
      ],
    },
  ],
}
