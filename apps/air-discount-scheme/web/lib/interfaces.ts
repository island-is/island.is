export interface AuthenticateUser {
  isAuthenticated: boolean
  user: User
}

export interface User {
  name: string
  nationalId: string
  mobile?: string
  token?: string
}

export type Role = 'developer' | 'admin' | 'user'
