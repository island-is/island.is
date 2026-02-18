export enum DelegationPaths {
  Delegations = '/adgangsstyring/umbod', // Outgoing delegations, i.e. from me
  DelegationsGrant = '/adgangsstyring/umbod/veita',
  DelegationAccess = '/adgangsstyring/umbod/:delegationId', // Incoming delegations, i.e. to me
  DelegationsIncoming = '/adgangsstyring/umbod-til-min',

  // Paths for updated delegation system
  DelegationsNew = '/umbod', // New person-centric view (testing)
  DelegationsGrantNew = '/umbod/veita', // New delegation grant flow
  ServiceCategories = '/umbod/thjonustuflokkar', // Service categories with permissions
}
