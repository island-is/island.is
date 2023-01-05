import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationPaths } from './lib/paths'

export const educationModule: PortalModule = {
  name: 'Menntun',
  widgets: () => [],
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: 'Menntun',
      path: EducationPaths.EducationRoot,
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
