export type StepUpMethod = 'app' | 'sim'

export type StepUpStatus =
  | 'pending'
  | 'confirmed'
  | 'denied'
  | 'timed_out'
  | 'expired'

export interface CibaStartRequest {
  /** The identity server authenticates the person behind this token. */
  userToken: string
  bindingMessage: string
  /** Signed by the person's key (app) and echoed on the token, so the result can be tied to this content. */
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

export const isCardSession = (amr: string[] | undefined) =>
  amr?.includes('sc') ?? false
