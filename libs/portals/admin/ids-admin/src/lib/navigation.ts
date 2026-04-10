import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { IDSAdminExternalPaths, IDSAdminPaths } from './paths'

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
    {
      name: m.documentation,
      description: m.documentationDescription,
      path: IDSAdminExternalPaths.Docs,
      external: true,
      // Required to render in the sidebar
      systemRoute: true,
      // TODO fix icon not rendering in another PR
      icon: {
        icon: 'open',
        type: 'outline',
      },
    },
  ],
}

export const idsAdminControlsNav: PortalNavigationItem = {
  name: m.idsAdmin,
  path: IDSAdminPaths.IDSAdmin,
  description: m.idsAdmin,
  activeIfExact: true,
  children: [
    {
      name: m.domains,
      path: IDSAdminPaths.IDSAdmin,
      description: m.idsAdmin,
      activeIfExact: true,
    },
    {
      name: m.adminControls,
      path: IDSAdminPaths.IDSAdminControlsApiScopeUsers,
      description: m.idsAdmin,
      activeIfExact: true,
      children: [
        {
          name: m.apiScopeUsers,
          path: IDSAdminPaths.IDSAdminControlsApiScopeUsers,
          description: m.idsAdmin,
          activeIfExact: true,
        },
        {
          name: m.grantTypes,
          path: IDSAdminPaths.IDSAdminControlsGrantTypes,
          description: m.idsAdmin,
          activeIfExact: true,
        },
        {
          name: m.idpProviders,
          path: IDSAdminPaths.IDSAdminControlsIdpProviders,
          description: m.idsAdmin,
          activeIfExact: true,
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
  children: [idsAdminNav, idsAdminControlsNav],
}
