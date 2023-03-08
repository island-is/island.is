import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { IDSAdminPaths } from './paths'

export const domainNav: PortalNavigationItem = {
  name: m.tenants,
  path: IDSAdminPaths.IDSAdminTenants,
  description: m.idsAdmin,
  activeIfExact: true,
  children: [
    {
      name: m.applications,
      path: IDSAdminPaths.IDSAdminTenants,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    {
      name: m.apis,
      path: IDSAdminPaths.IDSAdminDomainsAPIS,
      description: m.idsAdmin,
      activeIfExact: true,
    },
  ],
}

export const applicationNav: PortalNavigationItem = {
  name: m.applications,
  path: IDSAdminPaths.IDSAdminApplication,
  description: m.idsAdmin,
  activeIfExact: true,
  children: [
    {
      name: m.settings,
      path: IDSAdminPaths.IDSAdminApplication,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    {
      name: m.authentication,
      path: IDSAdminPaths.IDSAdminApplicationAuthentication,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    {
      name: m.advancedSettings,
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
