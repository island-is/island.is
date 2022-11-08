import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import {
  CreateCustomDelegation,
  CreateDomain,
} from '../../../../test/fixtures/types'
import addDays from 'date-fns/addDays'
import { AuthDelegationType } from 'delegation'

// TODO: Refactor to use satisfied operator in TypeScript 4.9
const createDomain = (domain: CreateDomain): CreateDomain => domain
const createDelegation = (
  delegation: CreateCustomDelegation,
): CreateCustomDelegation => delegation

export const testUser = createCurrentUser({
  scope: [AuthScope.delegations],
})

export const testCompanyActorNationalId = createNationalId('person')
export const testCompanyUser = createCurrentUser({
  nationalIdType: 'company',
  delegationType: AuthDelegationType.Custom,
  scope: [AuthScope.delegations],
  actor: {
    nationalId: testCompanyActorNationalId,
  },
})

export const testScopes = {
  mainValid: 'main.VALID',
  mainFuture: 'main.FUTURE',
  mainExpired: 'main.EXPIRED',
  mainNotAllowed: 'main.NOT_ALLOWED',
  otherValid: 'other.VALID',
}

export const testDomains = {
  main: createDomain({
    name: 'main',
    apiScopes: [
      { name: testScopes.mainValid, allowExplicitDelegationGrant: true },
      { name: testScopes.mainFuture, allowExplicitDelegationGrant: true },
      { name: testScopes.mainExpired, allowExplicitDelegationGrant: true },
      { name: testScopes.mainNotAllowed, allowExplicitDelegationGrant: false },
    ],
  }),
  other: createDomain({
    name: 'other',
    apiScopes: [
      { name: testScopes.otherValid, allowExplicitDelegationGrant: true },
    ],
  }),
}

export const testDelegations = {
  // Valid outgoing delegation
  validOutgoing: createDelegation({
    domainName: 'main',
    fromNationalId: testUser.nationalId,
    scopes: [{ scopeName: testScopes.mainValid }],
  }),
  // Valid but becomes active in the future outgoing delegation
  futureValidOutgoing: createDelegation({
    domainName: 'main',
    fromNationalId: testUser.nationalId,
    scopes: [
      { scopeName: testScopes.mainFuture, validFrom: addDays(new Date(), 2) },
    ],
  }),
  // Expired outgoing delegation
  expiredOutgoing: createDelegation({
    domainName: 'main',
    fromNationalId: testUser.nationalId,
    scopes: [
      {
        scopeName: testScopes.mainExpired,
        validFrom: addDays(new Date(), -30),
        validTo: addDays(new Date(), -5),
      },
    ],
  }),
  // With multiple scopes where one is active, one is expired and one is in future
  variedValidity: createDelegation({
    domainName: 'main',
    fromNationalId: testUser.nationalId,
    scopes: [
      { scopeName: testScopes.mainValid },
      { scopeName: testScopes.mainFuture, validFrom: addDays(new Date(), 2) },
      {
        scopeName: testScopes.mainExpired,
        validFrom: addDays(new Date(), -30),
        validTo: addDays(new Date(), -5),
      },
    ],
  }),
  // With scope that changes to be not allowed for delegation
  notAllowedOutgoing: createDelegation({
    domainName: 'main',
    fromNationalId: testUser.nationalId,
    scopes: [{ scopeName: testScopes.mainNotAllowed }],
  }),
  // With multiple scopes where one changes to be not allowed for delegation
  withOneNotAllowedOutgoing: createDelegation({
    domainName: 'main',
    fromNationalId: testUser.nationalId,
    scopes: [
      { scopeName: testScopes.mainValid },
      { scopeName: testScopes.mainNotAllowed },
    ],
  }),
  // Should not be able to edit incoming delegations.
  incomingValid: createDelegation({
    domainName: 'main',
    toNationalId: testUser.nationalId,
    scopes: [{ scopeName: testScopes.mainValid }],
  }),
  // Other users
  otherUsers: createDelegation({
    domainName: 'main',
    fromNationalId: createNationalId('person'),
    toNationalId: createNationalId('person'),
    scopes: [{ scopeName: testScopes.mainValid }],
  }),
  // Valid outgoing delegation in another domain
  validOutgoingInOtherDomain: createDelegation({
    domainName: 'other',
    fromNationalId: testUser.nationalId,
    scopes: [{ scopeName: testScopes.otherValid }],
  }),
}

export const testCompanyDelegations = {
  // Set up actor access.
  actorDelegation: createDelegation({
    domainName: 'main',
    fromNationalId: testCompanyUser.nationalId,
    toNationalId: testCompanyActorNationalId,
    scopes: [{ scopeName: testScopes.mainValid }],
  }),
  // Another delegation which the actor can see.
  validOutgoing: createDelegation({
    domainName: 'main',
    fromNationalId: testCompanyUser.nationalId,
    scopes: [{ scopeName: testScopes.mainValid }],
  }),
  // Actor has access to a scope in this domain so they can look up this delegation but can't see the scope.
  otherScope: createDelegation({
    domainName: 'main',
    fromNationalId: testCompanyUser.nationalId,
    scopes: [{ scopeName: testScopes.mainFuture }],
  }),
  // Actor has no access to this domain so they can't look up this delegation.
  otherDomain: createDelegation({
    domainName: 'other',
    fromNationalId: testCompanyUser.nationalId,
    scopes: [{ scopeName: testScopes.otherValid }],
  }),
}
