import { RouteObject, ScrollRestoration } from 'react-router-dom'
import { Root } from '../components/Root'

/**
 * Creates routes for the my-pages portal. All routes are defined here.
 * Note that the routes for the modules are created within PortalRouter {@link PortalRouter}.
 */
export const createRoutes = (moduleRoutes: RouteObject[]): RouteObject[] => [
  {
    element: (
      <>
        <Root />
        <ScrollRestoration
          getKey={(location) => {
            // Always scroll to top when the pathname changes
            return location.pathname
          }}
        />
      </>
    ),
    children: moduleRoutes,
  },
]
