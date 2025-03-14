import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { ApplicationsPaths } from './paths'

export const applicationsNavigation: PortalNavigationItem = {
  name: m.applications,
  path: ApplicationsPaths.ApplicationRoot,
  searchHide: true,
  description: m.applicationsDescription,
  icon: {
    icon: 'fileTrayFull',
  },
  children: [
    {
      name: m.myApplications,
      path: ApplicationsPaths.ApplicationRoot,
    },
    {
      name: m.inProgressApplications,
      path: ApplicationsPaths.ApplicationInProgressApplications,
    },
    {
      name: m.unfinishedApplications,
      path: ApplicationsPaths.ApplicationIncompleteApplications,
    },
    {
      name: m.finishedApplications,
      path: ApplicationsPaths.ApplicationCompleteApplications,
    },
  ],
}
