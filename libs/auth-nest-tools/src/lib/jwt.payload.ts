export interface JwtPayload {
  nationalId?: string
  scope: string | string[]
  client_id: string
  act?: {
    nationalId: string
    scope?: string | string[]
  }
}
