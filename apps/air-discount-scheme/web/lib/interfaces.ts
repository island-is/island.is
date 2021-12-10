export interface AuthenticateUser {
  isAuthenticated: boolean
  user: {
    name: string
    nationalId: string
    mobile?: string
  }
}

export interface User {
  name: string
  nationalId: string
  mobile?: string
  token?: string
}