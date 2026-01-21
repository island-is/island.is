export enum DelegationPaths {
  DelegationsGrant = '/adgangsstyring/umbod/veita',
  Delegations = '/adgangsstyring/umbod', // Outgoing delegations, i.e. from me
  DelegationAccess = '/adgangsstyring/umbod/:delegationId', // Incoming delegations, i.e. to me
  DelegationsIncoming = '/adgangsstyring/umbod-til-min',
  ServiceCategories = '/adgangsstyring/thjonustuflokkar', // Service categories with permissions
}
