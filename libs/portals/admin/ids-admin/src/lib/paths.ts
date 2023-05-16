export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  IDSAdminTenants = '/innskraningarkerfi/:tenant',
  IDSAdminDomainsAPIS = '/innskraningarkerfi/:tenant/vefthjonustur',
  IDSAdminClient = '/innskraningarkerfi/:tenant/forrit/:client',
  IDSAdminClientCreate = '/innskraningarkerfi/:tenant/forrit/stofna',
  IDSAdminClientPublish = '/innskraningarkerfi/:tenant/forrit/:client/gefa-ut',
  IDSAdminClientRotateSecret = '/innskraningarkerfi/:tenant/forrit/:client/endurnyja-leynilykil',
}
