import { PortalNavigationItem } from '@island.is/portals/core'
import { m as coreMessages } from '@island.is/portals/my-pages/core'
import { m } from './messages'
import { EducationPathsV2 } from './paths'

export const educationNavigationV2: PortalNavigationItem = {
  name: coreMessages.education,
  path: EducationPathsV2.Root,
  icon: {
    icon: 'school',
  },
  description: coreMessages.educationDescription,
  children: [
    {
      name: m.myEducation,
      path: EducationPathsV2.MyEducation,
    },
  ],
}
