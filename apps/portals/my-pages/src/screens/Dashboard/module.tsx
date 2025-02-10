import { lazy } from 'react'
import { PortalModule } from '@island.is/portals/core'
import { dashboardLoader } from './DashboardLoader'

const Dashboard = lazy(() => import('./Dashboard'))

export const indexModule: PortalModule = {
  name: 'Mínar Síður',
  routes: (props) => [
    {
      name: 'Mínar Síður',
      layout: 'full',
      path: '/',
      loader: dashboardLoader(props),
      element: <Dashboard />,
    },
  ],
}
