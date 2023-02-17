import { Outlet, RouteObject, ScrollRestoration } from 'react-router-dom'

import { Dashboard } from '../screens/Dashboard/Dashboard'
import { Layout } from '../components/Layout/Layout'

/**
 * Creates routes for the admin portal. All routes are defined here.
 * Note that the routes for the modules are created within PortalRouter {@link PortalRouter}.
 */
export const createRoutes = (moduleRoutes: RouteObject[]): RouteObject[] => [
  {
    element: (
      <>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
      </>
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
