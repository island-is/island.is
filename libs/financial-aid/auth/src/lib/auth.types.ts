import { User } from '@island.is/financial-aid/shared/index'

export type Credentials = {
  user: User
  csrfToken: string
}
