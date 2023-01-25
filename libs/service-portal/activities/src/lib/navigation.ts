import { PortalNavigationItem } from '@island.is/portals/core'

import { ActivitiesPaths } from './paths'
import { m } from './messages'

export const activitiesNavigation: PortalNavigationItem = {
  name: m.activities,
  path: ActivitiesPaths.Sessions,
  description: m.activitiesDescription,
  children: [
    {
      name: m.sessions,
      path: ActivitiesPaths.Sessions,
      //navHide: true,
    },
  ],
}
