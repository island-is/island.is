import { lazy } from 'react'
import { defineMessage } from 'react-intl'
import * as Sentry from '@sentry/react'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

export const eligibilityModule: ServicePortalModule = {
  name: 'Mín réttindi',
  widgets: () => [],
  routes: () => [
    {
      name: defineMessage({
        id: 'service.portal:eligibility',
        defaultMessage: 'Mín réttindi',
      }),
      path: ServicePortalPath.MyLicensesRoot,
      render: () => lazy(() => import('./screens/Eligibility')),
    },
  ],
}
