import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { EducationPaths } from './paths'

export const educationNavigationV2: PortalNavigationItem = {
  name: m.education,
  path: EducationPaths.EducationV2Root,
  icon: {
    icon: 'school',
  },
  description: m.educationDescription,
  children: [
    {
      name: m.educationGrunnskoli,
      path: EducationPaths.EducationV2Overview,
    },
  ],
}
