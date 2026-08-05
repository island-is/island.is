export type AuthUser = {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  nationalId: string
  accessToken: string
  refreshToken: string
  idToken: string
  role?: string
}

export type AuthSession = {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  expires: string
  accessToken: string
  idToken: string
  scope: string[]
}
