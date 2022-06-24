import { User } from '@island.is/shared/types'

export const checkDelegation = (user: User) => {
  return Boolean(user?.profile.actor)
}
