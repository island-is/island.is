import type { User } from './user'

/** The payload judicial-system-api signs into the access token cookie. */
export type Credentials = {
  currentUserNationalId: string
  currentUser?: User
  csrfToken?: string
}

export type AuthUser = {
  currentUserNationalId: string
  currentUser?: User
}
