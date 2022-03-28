import { createStore } from '@island.is/shared/mocking'
import { getUserProfileFactory } from './factories'

export const store = createStore(() => {
  const getUserProfile = getUserProfileFactory()

  return {
    getUserProfile,
  }
})
