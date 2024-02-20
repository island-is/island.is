import { Outlet, RouteObject } from 'react-router-dom'

import { UserProfileLocale } from '@island.is/shared/components'
import { ErrorShell, HeaderInfoProvider } from '@island.is/application/ui-shell'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { Layout } from '../components/Layout/Layout'
import { AssignApplication } from '../routes/AssignApplication'

export const BASE_PATH = '/umsoknir'

export type ApplicationProps = { applicationCategory: 'vottord' | 'standard' }

const ApplicationWrapper: React.FC<ApplicationProps> = ({
  applicationCategory,
}) => {
  console.log('application wrapper ' + applicationCategory)
  return <Application applicationCategory={applicationCategory} />
}

const ApplicationsWrapper: React.FC<ApplicationProps> = ({
  applicationCategory,
}) => {
  console.log('applications wrapper ' + applicationCategory)
  return <Applications applicationCategory={applicationCategory} />
}

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
        path: '/vottord/:slug/:id',
        element: <ApplicationWrapper applicationCategory="vottord" />,
      },
      {
        path: '/:slug/:id',
        element: <ApplicationWrapper applicationCategory="standard" />,
      },
      {
        path: '/vottord/:slug',
        element: <ApplicationsWrapper applicationCategory="vottord" />,
      },
      {
        path: '/:slug',
        element: <ApplicationsWrapper applicationCategory="standard" />,
      },
      {
        path: '*',
        element: <ErrorShell />,
      },
    ],
  },
]
