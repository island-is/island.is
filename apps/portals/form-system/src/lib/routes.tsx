import { Outlet, RouteObject } from "react-router-dom"
import { UserProfileLocale } from '@island.is/shared/components'
import { ExampleScreen } from "@island.is/form-system/ui"

export const BASE_PATH = '/form'

export const routes: RouteObject[] = [
  {
    element: (
      <>
        <UserProfileLocale />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: <ExampleScreen />
      },
      {
        path: '/:slug',
      },
      {
        path: '/:slug/:id'
      }
    ]

  }
]
