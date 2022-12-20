import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { ModuleIdentifiers } from '@island.is/portals/core'

export const educationLicenseModule: ServicePortalModule = {
  id: ModuleIdentifiers.EDUCATION_LICENSE,
  name: 'Leyfisbréf',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.educationLicense,
      path: ServicePortalPath.EducationLicense,
      enabled: userInfo.scopes.includes(ApiScope.educationLicense),
      render: () => lazy(() => import('./screens/EducationLicense')),
    },
  ],
}
