import { createBrowserRouter, Outlet } from 'react-router-dom'

import { UserProfileLocale } from '@island.is/shared/components'
import { ErrorShell, HeaderInfoProvider } from '@island.is/application/ui-shell'

import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { AssignApplication } from '../routes/AssignApplication'
import { Layout } from '../components/Layout/Layout'

export const createRoutes = (basename: string) =>
  createBrowserRouter(
    [
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
            path: '/:slug',
            element: <Applications />,
          },
          {
            path: '/:slug/:id',
            element: <Application />,
          },
          {
            path: '*',
            element: <ErrorShell />,
          },
        ],
      },
    ],
    {
      basename,
    },
  )
