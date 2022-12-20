import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { ModuleIdentifiers } from '@island.is/portals/core'

export const educationModule: ServicePortalModule = {
  id: ModuleIdentifiers.EDUCATION,
  name: 'Menntun',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: ServicePortalPath.EducationRoot,
      enabled: userInfo.scopes.includes(ApiScope.education),
      render: () =>
        lazy(() =>
          import(
            '../../education-career/src/screens/EducationCareer/EducationCareer'
          ),
        ),
    },
  ],
}
