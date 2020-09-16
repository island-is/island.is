import { User } from 'oidc-client'

export const userHasAccessToScope = (user: User, scope: string) => {
  return true
}
