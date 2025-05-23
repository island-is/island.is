import { Outlet, RouteObject } from 'react-router-dom'
import { UserProfileLocale } from '@island.is/shared/components'
import { HeaderInfoProvider } from '../context/HeaderInfoProvider'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { Layout } from '../components/Layout/Layout'

export const BASE_PATH = '/form'

export const routes: RouteObject[] = [
  {
    element: (
      <HeaderInfoProvider>
        {/* <UserProfileLocale /> */}
        <Layout>
          <Outlet />
        </Layout>
      </HeaderInfoProvider>
    ),
    children: [
      {
        errorElement: <></>,
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
        element: <>hoho</>,
      },
    ],
  },
]
