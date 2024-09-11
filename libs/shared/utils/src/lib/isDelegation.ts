import { BffUser, User } from '@island.is/shared/types'

export const checkDelegation = (user: User | BffUser) => {
  return Boolean(user?.profile.actor)
}
