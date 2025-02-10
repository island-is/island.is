import { BffUser } from '@island.is/shared/types'

export const checkDelegation = (user: BffUser) => {
  return Boolean(user.profile?.actor)
}
