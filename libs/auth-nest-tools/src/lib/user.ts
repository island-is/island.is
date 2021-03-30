export interface User {
  nationalId: string
  scope: string[]
  authorization: string
  client: string
  actor?: {
    nationalId: string
  }
  ip?: string
  userAgent?: string
}
