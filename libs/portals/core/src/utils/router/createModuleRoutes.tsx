import { RouteObject } from 'react-router-dom'
import { Box } from '@island.is/island-ui/core'
import {
  AccessDenied,
  ModuleRoute,
  NotFound,
  PortalModule,
  PortalRoute,
} from '../..'
import { ModuleErrorScreen } from '../../screens/ModuleErrorScreen'

type CreateRoutes = {
  routes: PortalRoute[]
  childRoute?: boolean
}

const createRoutes = ({ routes, childRoute }: CreateRoutes): RouteObject[] => {
  return routes.map((route) =>
    route.enabled === false
      ? {
          path: route.path,
          element: (
            <Box paddingY={1}>
              <AccessDenied />
            </Box>
          ),
        }
      : {
          path: route.path,
          element: <ModuleRoute route={route} />,
          loader: route.loader,
          action: route.action,
          handle: route.handle,
          id: route.id,
          errorElement: childRoute
            ? route.errorElement
            : route.errorElement || <ModuleErrorScreen name={route.name} />,
          ...(route.children && {
            children: createRoutes({
              routes: route.children,
              childRoute: true,
            }),
          }),
        },
  )
}

type CreateModuleRoutes = {
  modules: PortalModule[]
  routes: PortalRoute[]
}

export const createModuleRoutes = ({ routes, modules }: CreateModuleRoutes) => {
  if (modules.length > 0) {
    const moduleRoutes = createRoutes({ routes })

    if (routes.length > 0) {
      moduleRoutes.push({
        path: '*',
        element: <NotFound />,
      })
    }

    return moduleRoutes
  }

  return [
    {
      path: '*',
      element: (
        <Box paddingY={1}>
          <AccessDenied />
        </Box>
      ),
    },
  ]
}
