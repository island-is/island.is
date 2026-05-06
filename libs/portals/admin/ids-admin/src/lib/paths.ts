export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  // Permissions
  IDSAdminPermissions = '/innskraningarkerfi/:tenant/rettindi',
  IDSAdminPermissionsCreate = '/innskraningarkerfi/:tenant/rettindi/stofna',
  IDSAdminPermission = '/innskraningarkerfi/:tenant/rettindi/:permission',
  // Clients
  IDSAdminClients = '/innskraningarkerfi/:tenant/forrit',
  IDSAdminClient = '/innskraningarkerfi/:tenant/forrit/:client',
  IDSAdminClientCreate = '/innskraningarkerfi/:tenant/forrit/stofna',
  // Admin Controls
  IDSAdminControls = '/innskraningarkerfi/admin-controls',
  IDSAdminControlsApiScopeUsers = '/innskraningarkerfi/admin-controls/api-scope-users',
  IDSAdminControlsGrantTypes = '/innskraningarkerfi/admin-controls/grant-types',
  IDSAdminControlsIdpProviders = '/innskraningarkerfi/admin-controls/idp-providers',
}

export enum IDSAdminExternalPaths {
  Docs = 'https://docs.devland.is/products/auth',
  DocsClients = 'https://docs.devland.is/products/auth/configuration#defining-clients',
  DocsPermissions = 'https://docs.devland.is/products/auth/configuration#scope-configuration',
}
