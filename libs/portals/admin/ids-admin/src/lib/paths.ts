export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  IDSAdminTenants = '/innskraningarkerfi/:tenant',
  IDSAdminDomainsAPIS = '/innskraningarkerfi/:tenant/vefthjonustur',
  IDSAdminClient = '/innskraningarkerfi/:tenant/forrit/:client',
  IDSAdminClientCreate = '/innskraningarkerfi/:tenant/forrit/stofna',
  IDSAdminClientAuthentication = '/innskraningarkerfi/:tenant/forrit/:client/rettindi',
  IDSAdminClientAdvancedSettings = '/innskraningarkerfi/:tenant/forrit/:client/stillingar',
}
