import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationCareerPaths } from './lib/paths'
import { m } from '@island.is/portals/my-pages/core'

const EducationCareer = lazy(() =>
  import('./screens/EducationCareer/EducationCareer'),
)

export const educationCareerModule: PortalModule = {
  name: 'Námsferill',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.educationCareer,
      path: EducationCareerPaths.EducationCareer,
      enabled: userInfo.scopes.includes(ApiScope.education),
      element: <EducationCareer />,
    },
  ],
}
