export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  IDSAdminTenants = '/innskraningarkerfi/:tenant',
  IDSAdminDomainsAPIS = '/innskraningarkerfi/:tenant/vefthjonustur',
  IDSAdminPermissions = '/innskraningarkerfi/:tenant/rettindi',
  IDSAdminPermissionsCreate = '/innskraningarkerfi/:tenant/rettindi/stofna',
  IDSAdminPermission = '/innskraningarkerfi/:tenant/rettindi/:permission',
  IDSAdminClient = '/innskraningarkerfi/:tenant/forrit/:client',
  IDSAdminClientCreate = '/innskraningarkerfi/:tenant/forrit/stofna',
  IDSAdminClientPublish = '/innskraningarkerfi/:tenant/forrit/:client/gefa-ut',
}
