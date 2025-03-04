import { PortalNavigationItem } from '@island.is/portals/core'
import { m as cm } from '@island.is/portals/my-pages/core'
import { generalEducationMessages as gm } from './messages'
import { EducationPathsV2 } from './paths'

export const educationNavigationV2: PortalNavigationItem = {
  name: cm.education,
  path: EducationPathsV2.Root,
  icon: {
    icon: 'airplane',
  },
  description: cm.educationDescription,
  children: [
    {
      name: gm.primarySchool,
      path: EducationPathsV2.PrimarySchool,
    },
  ],
}
