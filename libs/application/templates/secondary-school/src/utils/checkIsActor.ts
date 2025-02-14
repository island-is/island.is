import { BffUser } from '@island.is/shared/types'

export const checkIsActor = (user: BffUser | null): boolean => {
  const isActor = !!user?.profile?.actor?.nationalId
  return isActor
}
