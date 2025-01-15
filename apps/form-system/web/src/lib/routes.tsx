import { Outlet, RouteObject } from 'react-router-dom'
import { UserProfileLocale } from '@island.is/shared/components'
import { HeaderInfoProvider } from '../context/HeaderInfoProvider'

export const BASE_PATH = '/form'

export const routes: RouteObject[] = [
  {
    element: (
      <HeaderInfoProvider>
        <UserProfileLocale>

        </UserProfileLocale>
      </HeaderInfoProvider>
    ),
    children: [
      {
        errorElement: <></>,
        children: [
          {
            path: '/:slug',
            element: <></> // many applications
          },
          {
            path: '/:slug/:id',
            element: <></> // single application
          }
        ]
      },
      {
        path: '*',
        element: <></>
      }
    ]
  }
]