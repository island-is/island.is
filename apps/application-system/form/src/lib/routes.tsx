import { Outlet, RouteObject } from 'react-router-dom'

import { UserProfileLocale } from '@island.is/shared/components'
import {
  ErrorShell,
  HeaderInfoProvider,
  JFormShell,
} from '@island.is/application/ui-shell'

import { Application, JApplication } from '../routes/Application'
import { Applications } from '../routes/Applications'
import { AssignApplication } from '../routes/AssignApplication'
import { Layout } from '../components/Layout/Layout'
import {
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  Form,
  FormItemTypes,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import { z } from 'zod'
import data from '@island.is/application/ui-shell'

export const BASE_PATH = '/umsoknir'

const newUrl = data.default as unknown as Form

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
            path: 'vottord/' + newUrl.id,
            element: <JApplication />,
          },
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
