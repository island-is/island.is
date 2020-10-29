export interface JwtPayload {
  natreg: string // TODO: Remove
  nationalId: string
  scope: string[]
}
