import { lazy } from 'react'
import { PortalModule } from '@island.is/portals/core'
import { dashboardLoader } from './screens/Dashboard/DashboardLoader'

const Dashboard = lazy(() => import('./screens/Dashboard//Dashboard'))
const Search = lazy(() => import('./screens/Search/Search'))

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
    {
      name: 'Leit',
      layout: 'full',
      key: 'Search',
      path: '/leit',
      element: <Search />,
    },
  ],
}
