import uniqBy from 'lodash/uniqBy'
import {
  domain,
  customDelegation,
  delegationScope,
  apiScope,
} from './factories'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const domains = domain.list(2)
  const scopesByDomain = Object.fromEntries(
    domains.map(({ name }) => [name, apiScope.list(6)]),
  )

  const outgoingDelegations = customDelegation.list(5, {
    domain: () => faker.random.arrayElement(domains),
    scopes: ({ domain }) => {
      const scopes = delegationScope.list(4, {
        apiScope: () => faker.random.arrayElement(scopesByDomain[domain.name]),
      })
      return uniqBy(scopes, 'apiScope')
    },
  })

  return {
    domains,
    scopesByDomain,
    outgoingDelegations,
  }
})
