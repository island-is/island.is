import { Outlet, RouteObject } from 'react-router-dom'
import { UserProfileLocale } from '@island.is/shared/components'
import { ExampleScreen } from '@island.is/form-system/ui'
import { FormsScreen } from '../screens/FormsScreen'

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
        element: <ExampleScreen />,
      },
      {
        //
        path: '/:slug',
        // Forms screen where a new form is created if the user has not created a form before, otherwise the user sees a list of formerly created forms with the option to create a new one
        element: <FormsScreen />
      },
      {
        path: '/:slug/:id',
      },
    ],
  },
]
