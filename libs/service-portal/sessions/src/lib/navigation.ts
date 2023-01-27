import { PortalNavigationItem } from '@island.is/portals/core'

import { SessionsPaths } from './paths'
import { m } from './messages'

export const sessionsNavigation: PortalNavigationItem = {
  name: m.sessions,
  path: SessionsPaths.Sessions,
  description: m.sessionsDescription,
  children: [
    {
      name: m.sessions,
      path: SessionsPaths.Sessions,
      //navHide: true,
    },
  ],
}
