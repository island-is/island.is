import {
  AuthDelegationType,
  AuthDelegationProvider,
} from '@island.is/shared/types'

export interface JwtAct {
  client_id: string
  act?: JwtAct
}

export interface JwtPayload {
  sub?: string
  sid?: string
  nationalId?: string
  scope: string | string[]
  client_id: string
  act?: JwtAct
  client_nationalId?: string
  delegationType?: AuthDelegationType[]
  actor?: {
    nationalId: string
    scope?: string | string[]
  }
  audkenni_sim_number?: string
  client_delegation_provider?: AuthDelegationProvider
}
