import { User } from '@island.is/financial-aid/shared/lib'

export type Credentials = {
  user: User
  csrfToken: string
}
