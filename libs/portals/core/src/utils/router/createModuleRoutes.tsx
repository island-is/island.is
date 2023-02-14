import { Box } from '@island.is/island-ui/core'
import {
  AccessDenied,
  ModuleRoute,
  NotFound,
  PrepareRouterDataReturnType,
} from '../..'

export const createModuleRoutes = ({
  routes,
  modules,
  userInfo,
}: PrepareRouterDataReturnType) => {
  if (modules.length > 0) {
    const moduleRoutes = routes.map((route) =>
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
            element: <ModuleRoute route={route} userInfo={userInfo} />,
          },
    )

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
