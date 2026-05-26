export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  IDSAdminTenantEdit = '/innskraningarkerfi/:tenant/breyta',
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
  IDSAdminControlsTranslations = '/innskraningarkerfi/admin-controls/translations',
  IDSAdminControlsLanguages = '/innskraningarkerfi/admin-controls/languages',
}

export enum IDSAdminExternalPaths {
  Docs = 'https://docs.devland.is/products/auth',
  DocsClients = 'https://docs.devland.is/products/auth/configuration#defining-clients',
  DocsPermissions = 'https://docs.devland.is/products/auth/configuration#scope-configuration',
}
