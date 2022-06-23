import { User } from '../../../types/src/index'

export const checkDelegation = (user: User) => {
  return Boolean(user?.profile.actor)
}
