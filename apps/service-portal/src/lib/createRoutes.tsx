import { RouteObject } from 'react-router-dom'
import { Dashboard } from '../screens/Dashboard/Dashboard'
import { Root } from '../components/Root'

/**
 * Create the router for the my-pages portal. All routes are defined here.
 */
export const createRoutes = (moduleRoutes: RouteObject[]): RouteObject[] => [
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      ...moduleRoutes,
    ],
  },
]
