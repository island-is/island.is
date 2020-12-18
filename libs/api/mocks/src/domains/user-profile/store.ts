import { userProfile } from './factories'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const profile = userProfile()

  return {
    profile
  }
})
