import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const educationLicenseModule: ServicePortalModule = {
  name: 'Leyfisbréf',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.educationLicense,
      path: ServicePortalPath.EducationLicense,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      render: () => lazy(() => import('./screens/EducationLicense')),
    },
  ],
}
