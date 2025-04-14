import { Resolvers } from '../../types'
import { customDelegation, delegationScope } from './factories'
import { store } from './store'
import { store as identityStore } from '../identity/store'

export const resolvers: Resolvers = {
  AuthScopeTreeNode: {
    __resolveType: () => 'AuthApiScope',
  },
  Query: {
    authDomains: () => store.domains,
    authDelegations: () => store.outgoingDelegations,
    authDelegation: (_, { input }) =>
      store.outgoingDelegations.find(
        (delegation) => delegation.id === input.delegationId,
      ) ?? null,
    authScopeTree: (_, { input }) => store.scopesByDomain[input.domain!],
  },
  Mutation: {
    createAuthDelegation: (_, { input }) => {
      const toIdentity = identityStore.identities.find(
        (identity) => identity.nationalId === input.toNationalId,
      )
      const domain = store.domains.find(
        (domain) => domain.name === input.domainName,
      )
      const newDelegation = customDelegation({
        to: toIdentity,
        scopes: [],
        domain,
      })

      store.outgoingDelegations.push(newDelegation)
      return newDelegation
    },
    updateAuthDelegation: (_, { input }) => {
      const delegation = store.outgoingDelegations.find(
        (delegation) => delegation.id === input.delegationId,
      )!
      const availableScopes = store.scopesByDomain[delegation.domain.name]
      delegation.scopes = input.scopes.map((scope) =>
        delegationScope({
          apiScope: availableScopes.find(
            (apiScope) => scope.name === apiScope.name,
          ),
          validTo: scope.validTo,
        }),
      )
      return delegation
    },
    deleteAuthDelegation: (_, { input }) => {
      store.outgoingDelegations = store.outgoingDelegations.filter(
        (delegation) => delegation.id !== input.delegationId,
      )
      return true
    },
  },
}
