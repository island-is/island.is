import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { ApplicationSystemPaths } from './paths'

export const applicationSystemNavigation: PortalNavigationItem = {
  name: m.applicationSystem,
  path: ApplicationSystemPaths.Root,
  icon: {
    icon: 'settings',
  },
  description: m.applicationSystemDescription,
  children: [
    {
      name: m.overview,
      path: ApplicationSystemPaths.Overview,
      activeIfExact: true,
    },
    {
      name: m.statistics,
      path: ApplicationSystemPaths.Statistics,
      activeIfExact: true,
    },
  ],
}
