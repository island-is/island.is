import { Outlet, RouteObject } from 'react-router-dom'
import { UserProfileLocale } from '@island.is/shared/components'
import { HeaderInfoProvider } from '../context/HeaderInfoProvider'
import { Header } from '@island.is/island-ui/core'

export const BASE_PATH = '/form'

export const routes: RouteObject[] = [
  {
    element: (
      <HeaderInfoProvider>
        <UserProfileLocale />
        <>
          <Header />
        </>
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