import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

export const educationCareerModule: ServicePortalModule = {
  name: 'Námsferill',
  widgets: () => [],
  routes: () => [
    {
      name: m.educationCareer,
      path: ServicePortalPath.EducationCareer,
      render: () => lazy(() => import('./screens/EducationCareer')),
    },
  ],
}
