import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { EducationLicensePaths } from './lib/paths'
import { m } from '@island.is/portals/my-pages/core'

const EducationLicense = lazy(() =>
  import('./screens/EducationLicense/EducationLicense'),
)

export const educationLicenseModule: PortalModule = {
  name: 'Leyfisbréf',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.educationLicense,
      path: EducationLicensePaths.EducationLicense,
      enabled: userInfo.scopes.includes(ApiScope.educationLicense),
      element: <EducationLicense />,
    },
  ],
}
