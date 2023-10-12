import { Outlet, RouteObject } from 'react-router-dom'

import { UserProfileLocale } from '@island.is/shared/components'
import { ErrorShell, HeaderInfoProvider } from '@island.is/application/ui-shell'

import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { AssignApplication } from '../routes/AssignApplication'
import { Layout } from '../components/Layout/Layout'
import { Form } from '@island.is/application/types'

export const BASE_PATH = '/umsoknir'

/**
 * Creates routes for application-system. All routes are defined here.
 */
export const routes: RouteObject[] = [
  {
    element: (
      <HeaderInfoProvider>
        <UserProfileLocale />
        <Layout>
          <Outlet />
        </Layout>
      </HeaderInfoProvider>
    ),
    children: [
      {
        path: '/tengjast-umsokn',
        element: <AssignApplication />,
      },
      {
        errorElement: <ErrorShell />,
        children: [
          {
            path: '/:slug',
            element: <Applications />,
          },
          {
            path: '/:slug/:id',
            element: <Application />,
          },
        ],
      },
      {
        path: '*',
        element: <ErrorShell />,
      },
    ],
  },
]
