import { Auth } from './auth'

export interface User extends Auth {
  sub: string
  nationalId: string
}
