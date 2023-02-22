import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { IDSAdminPaths } from './paths'

export const domainNav: PortalNavigationItem = {
  name: 'Domains',
  path: IDSAdminPaths.IDSAdminDomains,
  description: m.idsAdmin,
  activeIfExact: true,
  children: [
    {
      name: 'Applications',
      path: IDSAdminPaths.IDSAdminDomains,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    {
      name: 'APIs',
      path: IDSAdminPaths.IDSAdminDomainsAPIS,
      description: m.idsAdmin,
      activeIfExact: true,
    },
  ],
}

export const applicationNav: PortalNavigationItem = {
  name: 'Application',
  path: IDSAdminPaths.IDSAdminApplication,
  description: m.idsAdmin,
  activeIfExact: true,
  children: [
    {
      name: 'Settings',
      path: IDSAdminPaths.IDSAdminApplication,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    {
      name: 'Authentication',
      path: IDSAdminPaths.IDSAdminApplicationAuthentication,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    {
      name: 'Advanced Settings',
      path: IDSAdminPaths.IDSAdminApplicationAdvancedSettings,
      description: m.idsAdmin,
      activeIfExact: true,
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
  children: [{ ...domainNav }, { ...applicationNav }],
}
