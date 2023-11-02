import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { ServiceDeskPaths } from './paths'

export const serviceDeskNavigation: PortalNavigationItem = {
  name: m.serviceDesk,
  path: ServiceDeskPaths.Root,
  icon: {
    icon: 'settings',
  },
  description: m.serviceDeskDescription,
  children: [
    {
      name: m.serviceDesk,
      path: ServiceDeskPaths.Root,
      activeIfExact: true,
    },
  ],
}
