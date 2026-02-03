export enum DelegationPaths {
  DelegationsGrant = '/adgangsstyring/umbod/veita',
  DelegationsGrantNew = '/adgangsstyring/umbod/veita-nytt', // New delegation grant flow
  Delegations = '/adgangsstyring/umbod', // Outgoing delegations, i.e. from me
  DelegationsNew = '/adgangsstyring/umbod-nytt', // New person-centric view (testing)
  DelegationAccess = '/adgangsstyring/umbod/:delegationId', // Incoming delegations, i.e. to me
  DelegationsIncoming = '/adgangsstyring/umbod-til-min',
  ServiceCategories = '/adgangsstyring/thjonustuflokkar', // Service categories with permissions
}
