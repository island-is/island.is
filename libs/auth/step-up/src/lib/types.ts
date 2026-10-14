export type StepUpMethod = 'app' | 'sim'

export type StepUpStatus =
  | 'pending'
  | 'confirmed'
  | 'denied'
  | 'timed_out'
  | 'expired'

export interface CibaStartRequest {
  userToken: string
  bindingMessage: string
  contextHash?: string
}

export interface CibaStartResult {
  authReqId: string
  method: StepUpMethod
  expiresIn: number
  interval: number
  verificationCode?: string
}

export interface StepUpClaims {
  sub: string
  nationalId: string
  acr?: string
  amr: string[]
  authTime: Date
  certificateThumbprint?: string
  contextHash?: string
}

export type CibaPollResult =
  | { status: 'pending' }
  | { status: 'denied' }
  | { status: 'expired' }
  | { status: 'authenticated'; claims: StepUpClaims }

export type SessionLoginMethod =
  | 'app'
  | 'sim'
  | 'card'
  | 'devicelink'
  | 'passkey'

/**
 * idp names the login method (amr only describes the authentication). A passkey
 * session keeps the idp of the login that registered the passkey, so acr marks it.
 */
export const sessionLoginMethod = ({
  idp,
  acr,
}: {
  idp?: string
  acr?: string
}): SessionLoginMethod | undefined => {
  if (acr === 'islandis-passkey') {
    return 'passkey'
  }
  switch (idp) {
    case 'audkenni_app':
      return 'app'
    case 'audkenni_sim':
      return 'sim'
    case 'audkenni_devicelink':
      return 'devicelink'
    case 'audkenni_card':
    case 'audkenni_newcard':
    case 'audkenni_oldcard':
      return 'card'
  }
  return undefined
}

export const isCardSession = (session: { idp?: string; acr?: string }) =>
  sessionLoginMethod(session) === 'card'
