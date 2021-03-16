import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

export const educationCareerModule: ServicePortalModule = {
  name: 'Námsferill',
  widgets: () => [],
  routes: () => [
    {
      name: defineMessage({
        id: 'service.portal:educationCareer',
        defaultMessage: 'Námsferill',
      }),
      path: ServicePortalPath.EducationCareer,
      render: () => lazy(() => import('./screens/EducationCareer')),
    },
  ],
}
