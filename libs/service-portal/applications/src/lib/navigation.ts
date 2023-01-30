import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { ApplicationsPaths } from './paths'

export const applicationsNavigation: PortalNavigationItem = {
  name: m.applications,
  path: ApplicationsPaths.ApplicationRoot,
  icon: {
    icon: 'fileTrayFull',
  },
  serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
  children: [
    {
      name: m.myApplications,
      path: ApplicationsPaths.ApplicationRoot,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
    {
      name: m.inProgressApplications,
      path: ApplicationsPaths.ApplicationInProgressApplications,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
    {
      name: m.unfinishedApplications,
      path: ApplicationsPaths.ApplicationIncompleteApplications,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
    {
      name: m.finishedApplications,
      path: ApplicationsPaths.ApplicationCompleteApplications,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
  ],
  description: m.applicationsDescription,
  isKeyitem: true,
}
