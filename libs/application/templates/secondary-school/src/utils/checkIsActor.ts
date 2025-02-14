import { BffUser } from '@island.is/shared/types'
import { checkDelegation } from '@island.is/shared/utils'

export const checkIsActor = (user: BffUser | null): boolean => {
  return user ? checkDelegation(user) : false
}
