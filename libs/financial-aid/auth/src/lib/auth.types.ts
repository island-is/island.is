import { User } from '@island.is/financial-aid/types'

export type Credentials = {
  user: User
  csrfToken: string
}
