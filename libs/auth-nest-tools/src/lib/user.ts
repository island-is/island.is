export interface User {
  nationalId: string
  scope: string[]
  authorization: string
  actor?: {
    nationalId: string
  }
}
