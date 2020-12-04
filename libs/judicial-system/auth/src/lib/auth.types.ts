import { User } from 'libs/judicial-system/types/src'

export type Credentials = {
  user: User
  csrfToken: string
}
