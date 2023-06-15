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
  IDSAdminClientPublish = '/innskraningarkerfi/:tenant/forrit/:client/gefa-ut',
  IDSAdminClientRotateSecret = '/innskraningarkerfi/:tenant/forrit/:client/endurnyja-leynilykil',
  IDSAdminClientRevokeSecrets = '/innskraningarkerfi/:tenant/forrit/:client/afturkalla-leynilykla',
}
