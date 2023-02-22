export enum IDSAdminPaths {
  IDSAdmin = '/innskraningarkerfi',
  IDSAdminDomains = '/innskraningarkerfi/:tenant',
  IDSAdminDomainsApplications = '/innskraningarkerfi/:tenant/forrit',
  IDSAdminDomainsAPIS = '/innskraningarkerfi/:tenant/vefthjonustur',
  //IDSAdminDomainsAdminControl = '/innskraningarkerfi/:tenant/admin-control',
  IDSAdminApplication = '/innskraningarkerfi/:tenant/forrit/:application',
  IDSAdminApplicationAuthentication = '/innskraningarkerfi/:tenant/forrit/:application/rettindi',
  IDSAdminApplicationAdvancedSettings = '/innskraningarkerfi/:tenant/forrit/:application/stillingar',
}
