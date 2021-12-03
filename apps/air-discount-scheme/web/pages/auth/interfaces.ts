export interface AuthenticateUser {
  isAuthenticated: boolean
  user: {
    name: string
    nationalId: string
    mobile?: string
  }
}