import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { IDSAdminPaths } from './paths'

export const idsAdminNavigation: PortalNavigationItem = {
  name: m.idsAdmin,
  path: IDSAdminPaths.IDSAdmin,
  icon: {
    icon: 'settings',
  },
  description: m.idsAdmin,
  children: [
    {
      name: 'Domains',
      path: IDSAdminPaths.IDSAdminDomains,
      description: m.idsAdmin,
      children: [
        {
          name: 'Applications',
          path: IDSAdminPaths.IDSAdminDomainsApplications,
          description: m.idsAdmin,
        },
        {
          name: 'APIs',
          path: IDSAdminPaths.IDSAdminDomainsAPIS,
          description: m.idsAdmin,
        },
        {
          name: 'Admin Control',
          path: IDSAdminPaths.IDSAdminDomainsAdminControl,
          description: m.idsAdmin,
        },
        {
          name: 'Application',
          path: IDSAdminPaths.IDSAdminApplicationSettings,
          description: m.idsAdmin,
          navHide: true,
          children: [
            {
              name: 'Authentication',
              path: IDSAdminPaths.IDSAdminApplicationAuthentication,
              description: m.idsAdmin,
            },
            {
              name: 'Advanced Settings',
              path: IDSAdminPaths.IDSAdminApplicationAdvancedSettings,
              description: m.idsAdmin,
            },
          ],
        },
      ],
    },
  ],
}

console.log('ids-admin-module', idsAdminNavigation)
