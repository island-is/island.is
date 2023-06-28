import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import { ServiceDeskPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { lazy } from 'react'

const ServiceDesk = lazy(() => import('./screens/service-desk'))

export const serviceDeskModule: PortalModule = {
  name: m.serviceDesk,
  layout: 'default',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.serviceDesk),
  routes: (props) => [
    {
      name: m.serviceDesk,
      path: ServiceDeskPaths.Root,
      element: <ServiceDesk />,
    },
  ],
}
