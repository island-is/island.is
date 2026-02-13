export enum DelegationPaths {
  DelegationsGrant = '/adgangsstyring/umbod/veita',
  DelegationsGrantNew = '/adgangsstyring/umbod/veita-nytt', // New delegation grant flow
  DelegationsGrantScopes = '/adgangsstyring/umbod/veita-nytt/rettindi', // New delegation grant flow step 2, select scopes
  DelegationsGrantPeriod = '/adgangsstyring/umbod/veita-nytt/gildistimi', // New delegation grant flow step 3, select period
  Delegations = '/adgangsstyring/umbod', // Outgoing delegations, i.e. from me
  DelegationsNew = '/adgangsstyring/umbod-nytt', // New person-centric view (testing)
  DelegationAccess = '/adgangsstyring/umbod/:delegationId', // Incoming delegations, i.e. to me
  DelegationsIncoming = '/adgangsstyring/umbod-til-min',
  ServiceCategories = '/adgangsstyring/thjonustuflokkar', // Service categories with permissions
}
