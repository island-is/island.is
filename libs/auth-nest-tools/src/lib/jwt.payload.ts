export interface JwtPayload {
  nationalId: string
  scope: string[]
  act?: {
    nationalId: string
  }
}
