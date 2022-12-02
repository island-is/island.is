import { Auth } from './auth'

export interface User extends Auth {
  nationalId: string
  sub: string
}
