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
      name: m.procures,
      path: ServiceDeskPaths.Companies,
      activeIfExact: true,
      children: [
        {
          name: m.procures,
          path: ServiceDeskPaths.Company,
          activeIfExact: true,
          navHide: true,
        },
      ],
    },
    {
      name: m.users,
      path: ServiceDeskPaths.Users,
      activeIfExact: true,
      children: [
        {
          name: m.user,
          path: ServiceDeskPaths.User,
          activeIfExact: true,
          navHide: true,
        },
      ],
    },
  ],
}
