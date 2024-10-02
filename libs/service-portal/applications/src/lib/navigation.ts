import { PortalNavigationItem } from '@island.is/portals/core'
import { m as coreMessages } from '@island.is/service-portal/core'
import { m } from '../lib/messages'
import { ApplicationsPaths } from './paths'

export const applicationsNavigation: PortalNavigationItem = {
  name: coreMessages.applications,
  description: coreMessages.applicationsDescription,
  serviceProvider: 'stafraent-island',
  path: ApplicationsPaths.ApplicationRoot,
  icon: {
    icon: 'fileTrayFull',
  },
  children: [
    {
      name: coreMessages.myApplications,
      heading: m.heading,
      intro: m.introCopy,
      displayIntroHeader: true,
      path: ApplicationsPaths.ApplicationMyApplications,
    },
    {
      name: coreMessages.inProgressApplications,
      heading: m.headingInProgress,
      intro: m.introCopyInProgress,
      displayIntroHeader: true,
      path: ApplicationsPaths.ApplicationInProgressApplications,
    },
    {
      name: coreMessages.unfinishedApplications,
      heading: m.headingIncomplete,
      intro: m.introCopyIncomplete,
      displayIntroHeader: true,
      path: ApplicationsPaths.ApplicationIncompleteApplications,
    },
    {
      name: coreMessages.finishedApplications,
      heading: m.headingFinished,
      intro: m.introCopyFinished,
      displayIntroHeader: true,
      path: ApplicationsPaths.ApplicationCompleteApplications,
    },
  ],
}
