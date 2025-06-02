import { Outlet, RouteObject } from 'react-router-dom'
import { HeaderInfoProvider } from '../context/HeaderInfoProvider'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { Layout } from '../components/Layout/Layout'
import { NotFound } from '@island.is/portals/core'

export const BASE_PATH = '/form'

export const routes: RouteObject[] = [
  {
    element: (
      <HeaderInfoProvider>
        <Layout>
          <Outlet />
        </Layout>
      </HeaderInfoProvider>
    ),
    children: [
      {
        // errorElement: <></>,  TODO: Add error element
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
        element: <NotFound />,
      },
    ],
  },
]
