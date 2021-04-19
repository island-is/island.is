export interface JwtPayload {
  nationalId?: string
  scope: string[]
  client_id: string
  act?: {
    nationalId: string
  }
}
