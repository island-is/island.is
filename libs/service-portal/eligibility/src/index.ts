import { lazy } from 'react'
import { defineMessage } from 'react-intl'
import * as Sentry from '@sentry/react'

import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const eligibilityModule: ServicePortalModule = {
  name: 'Mín réttindi',
  widgets: () => [],
  routes: () => [
    {
      name: m.eligibility,
      path: ServicePortalPath.MyLicensesRoot,
      render: () => lazy(() => import('./screens/Eligibility')),
    },
  ],
}
