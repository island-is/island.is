import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages } from '@island.is/portals/my-pages/core'
import { ApplicationsPaths } from './paths'

export const applicationsNavigation: PortalNavigationItem = {
  name: m.applications,
  path: ApplicationsPaths.ApplicationRoot,
  searchTags: [
    searchTagsMessages.applicationsApplicant,
    searchTagsMessages.applicationsApply,
  ],
  description: m.applicationsDescription,
  icon: {
    icon: 'fileTrayFull',
  },
  children: [
    {
      name: m.myApplications,
      description: m.applicationsIntro,
      path: ApplicationsPaths.ApplicationRoot,
    },
    {
      name: m.inProgressApplications,
      description: m.applicationsIntroInProgress,
      path: ApplicationsPaths.ApplicationInProgressApplications,
    },
    {
      name: m.unfinishedApplications,
      description: m.applicationsIntroUnfinished,
      path: ApplicationsPaths.ApplicationIncompleteApplications,
    },
    {
      name: m.finishedApplications,
      description: m.applicationsIntroFinished,
      path: ApplicationsPaths.ApplicationCompleteApplications,
    },
  ],
}
