import { RouteObject } from 'react-router-dom'
import { Box } from '@island.is/island-ui/core'
import {
  AccessDenied,
  ModuleRoute,
  NotFound,
  PrepareRouterDataReturnType,
} from '../..'
import { ModuleErrorScreen } from '../../screens/ModuleErrorScreen'

type CreateRoutes = {
  childRoute?: boolean
} & Pick<PrepareRouterDataReturnType, 'routes' | 'userInfo'>

const createRoutes = ({
  routes,
  userInfo,
  childRoute,
}: CreateRoutes): RouteObject[] => {
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
          errorElement: childRoute ? (
            route.errorElement
          ) : (
            <ModuleErrorScreen name={route.name} />
          ),
          ...(route.children && {
            children: createRoutes({
              routes: route.children,
              userInfo,
              childRoute: true,
            }),
          }),
        },
  )
}

export const createModuleRoutes = ({
  routes,
  modules,
  userInfo,
}: PrepareRouterDataReturnType) => {
  if (modules.length > 0) {
    const moduleRoutes = createRoutes({ routes, userInfo })

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
