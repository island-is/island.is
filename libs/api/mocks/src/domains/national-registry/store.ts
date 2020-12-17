import { registryUser } from './factories'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)
  const user = registryUser()
  return { user }
})
