export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  // Tenants
  IDSAdminTenants = '/innskraningarkerfi/:tenant',
  IDSAdminTenantsAPIS = '/innskraningarkerfi/:tenant/vefthjonustur',
  // Permissions
  IDSAdminPermissions = '/innskraningarkerfi/:tenant/rettindi',
  IDSAdminPermissionsCreate = '/innskraningarkerfi/:tenant/rettindi/stofna',
  IDSAdminPermission = '/innskraningarkerfi/:tenant/rettindi/:permission',
  // Clients
  IDSAdminClient = '/innskraningarkerfi/:tenant/forrit/:client',
  IDSAdminClientCreate = '/innskraningarkerfi/:tenant/forrit/stofna',
  IDSAdminClientPublish = '/innskraningarkerfi/:tenant/forrit/:client/gefa-ut',
}
