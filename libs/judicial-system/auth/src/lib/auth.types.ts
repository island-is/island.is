import { User } from '@island.is/judicial-system/types'

export type Credentials = {
  user: User
  csrfToken: string
}
