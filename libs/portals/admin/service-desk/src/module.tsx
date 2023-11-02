import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { m } from './lib/messages'
import { ServiceDeskPaths } from './lib/paths'
import { CompaniesAction } from './screens/Companies/Companies.action'
import { procurersLoader } from './screens/Procurers/Procurers.loader'

const Companies = lazy(() => import('./screens/Companies/Companies'))
const Procures = lazy(() => import('./screens/Procurers/Procurers'))
export const serviceDeskModule: PortalModule = {
  name: m.serviceDesk,
  layout: 'default',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.serviceDesk),
  routes: (props) => [
    {
      name: m.serviceDesk,
      path: ServiceDeskPaths.Root,
      element: <Companies />,
      action: CompaniesAction(props),
    },
    {
      name: m.procures,
      path: ServiceDeskPaths.Procurers,
      element: <Procures />,
      loader: procurersLoader(props),
      navHide: true,
    },
  ],
}
