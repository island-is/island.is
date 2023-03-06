export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  IDSAdminTenants = '/innskraningarkerfi/:tenant',
  IDSAdminDomainsAPIS = '/innskraningarkerfi/:tenant/vefthjonustur',
  IDSAdminApplication = '/innskraningarkerfi/:tenant/forrit/:application',
  IDSAdminApplicationAuthentication = '/innskraningarkerfi/:tenant/forrit/:application/rettindi',
  IDSAdminApplicationAdvancedSettings = '/innskraningarkerfi/:tenant/forrit/:application/stillingar',
}
