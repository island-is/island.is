import { Outlet, RouteObject } from 'react-router-dom'
import { HeaderInfoProvider } from '../context/HeaderInfoProvider'
import { Application } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { Layout } from '../components/Layout/Layout'
import { ErrorShell } from '../components/ErrorShell/ErrorShell'
import { NotFound } from '@island.is/portals/core'
import { m } from './messages'

export const BASE_PATH = '/form'

const UnexpectedErrorShell = () => (
  <ErrorShell
    title={m.unexpectedErrorTitle}
    subTitle={m.unexpectedErrorSubtitle}
    description={m.unexpectedErrorDescription}
    retryText={m.reloadPage}
    onRetry={() => window.location.reload()}
  />
)

export const routes: RouteObject[] = [
  {
    element: (
      <HeaderInfoProvider>
        <Layout>
          <Outlet />
        </Layout>
      </HeaderInfoProvider>
    ),
    errorElement: <UnexpectedErrorShell />,
    children: [
      {
        errorElement: <UnexpectedErrorShell />,
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
