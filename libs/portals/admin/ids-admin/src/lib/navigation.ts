import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { IDSAdminPaths } from './paths'

export const idsAdminNav: PortalNavigationItem = {
  name: m.tenants,
  path: IDSAdminPaths.IDSAdminClients,
  description: m.idsAdmin,
  activeIfExact: true,
  children: [
    {
      name: m.clients,
      path: IDSAdminPaths.IDSAdminClients,
      description: m.idsAdmin,
      activeIfExact: true,
      children: [
        {
          name: m.clients,
          path: IDSAdminPaths.IDSAdminClient,
          description: m.idsAdmin,
          activeIfExact: true,
          navHide: true,
        },
      ],
    },
    {
      name: m.permissions,
      path: IDSAdminPaths.IDSAdminPermissions,
      description: m.idsAdmin,
      activeIfExact: true,
      children: [
        {
          name: m.permissions,
          path: IDSAdminPaths.IDSAdminPermission,
          description: m.idsAdmin,
          activeIfExact: true,
          navHide: true,
        },
      ],
    },
  ],
}

export const idsAdminNavigation: PortalNavigationItem = {
  name: m.idsAdmin,
  path: IDSAdminPaths.IDSAdmin,
  icon: {
    icon: 'settings',
  },
  description: m.idsAdmin,
  children: [idsAdminNav],
}
