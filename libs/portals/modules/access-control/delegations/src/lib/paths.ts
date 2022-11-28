export enum AccessControlDelegationPaths {
  AccessControlDelegationsGrant = '/adgangsstyring/umbod/veita',
  AccessControlDelegations = '/adgangsstyring/umbod', // Outgoing delegations, i.e. from me
  AccessControlDelegationAccess = '/adgangsstyring/umbod/:delegationId', // Incoming delegations, i.e. to me
  AccessControlDelegationsIncoming = '/adgangsstyring/umbod-til-min',
}
