import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'

import { SessionsPaths } from './paths'

export const sessionsNavigation: PortalNavigationItem = {
  name: m.sessions,
  path: SessionsPaths.Sessions,
}
