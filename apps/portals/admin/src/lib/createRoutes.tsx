import { Outlet, RouteObject } from 'react-router-dom'
import { Dashboard } from '../screens/Dashboard/Dashboard'
import { Layout } from '../components/Layout/Layout'

/**
 * Create the router for the admin portal. All routes are defined here.
 */
export const createRoutes = (moduleRoutes: RouteObject[]): RouteObject[] => [
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      ...moduleRoutes,
    ],
  },
]
