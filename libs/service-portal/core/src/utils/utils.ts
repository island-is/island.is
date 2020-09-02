import { UserWithMeta } from '../lib/service-portal-core'

export const userHasAccessToScope = (user: UserWithMeta, scope: string) => {
  return true
}
