import { User } from '@island.is/judicial-system/types'

export type Credentials = {
  user: User
  csrfToken: string
}

export interface RolesRule {
  role: string
  dtoFields: string[]
}
