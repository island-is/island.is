import { createBrowserRouter } from 'react-router-dom'
import {
  AuthSettings,
  OidcSignIn,
  OidcSilentSignIn,
  CheckAuth,
} from '@island.is/auth/react'
import { Dashboard } from '../screens/Dashboard/Dashboard'
import { AdminPortalPaths } from './paths'
import { Root } from '../components/Root'
import { Modules } from '@island.is/portals/core'
import { Box } from '@island.is/island-ui/core'

type CreateRouterTree = Pick<
  AuthSettings,
  'redirectPathSilent' | 'redirectPath'
>

export const createRouterTree = ({
  redirectPathSilent,
  redirectPath,
}: CreateRouterTree) =>
  createBrowserRouter(
    [
      {
        element: <Root />,
        children: [
          {
            path: redirectPath,
            element: <OidcSignIn />,
          },
          {
            path: redirectPathSilent,
            element: <OidcSilentSignIn />,
          },
          {
            path: '*',
            element: <CheckAuth />,
            children: [
              {
                path: '',
                element: <Dashboard />,
              },
              {
                path: '*',
                element: (
                  <Box paddingY={1}>
                    <Modules />
                  </Box>
                ),
              },
            ],
          },
        ],
      },
    ],
    {
      basename: AdminPortalPaths.Base,
    },
  )
