import { createStore } from '@island.is/shared/mocking'
import { identity } from './factories'

export const store = createStore(() => {
  const identities = [
    identity({ nationalId: '1111111111' }),
    identity({ nationalId: '0101307789', name: 'Gervimaður Útlönd' }),
  ]
  return {
    identities,
  }
})
