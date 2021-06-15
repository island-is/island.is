export interface Auth {
  nationalId?: string
  scope: string[]
  authorization: string
  client: string
  actor?: {
    nationalId: string
    scope: string[]
  }
  ip?: string
  userAgent?: string
}
