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
      name: m.clients,
      path: IDSAdminPaths.IDSAdminTenants,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    // {
    //   name: m.apis,
    //   path: IDSAdminPaths.IDSAdminDomainsAPIS,
    //   description: m.idsAdmin,
    //   activeIfExact: true,
    // },
  ],
}

export const applicationNav: PortalNavigationItem = {
  name: m.clients,
  path: IDSAdminPaths.IDSAdminClient,
  description: m.idsAdmin,
  activeIfExact: true,
  children: [
    {
      name: m.clients,
      path: IDSAdminPaths.IDSAdminClient,
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
