export type JwtDelegationType = 'ProcurationHolder' | 'LegalGuardian' | 'Custom'

export interface JwtAct {
  client_id: string
  act?: JwtAct
}

export interface JwtPayload {
  nationalId?: string
  scope: string | string[]
  client_id: string
  act?: JwtAct
  client_nationalId?: string
  delegationTypes?: JwtDelegationType[]
  actor?: {
    nationalId: string
    scope?: string | string[]
  }
}
