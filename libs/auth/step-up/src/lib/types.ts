export type StepUpMethod = 'app' | 'sim'

/** Where a step-up stands, as the clients see it. Shared by every consumer. */
export type StepUpStatus =
  | 'not_started'
  | 'pending'
  | 'confirmed'
  | 'denied'
  | 'timed_out'
  | 'expired'

export interface CibaStartRequest {
  /**
   * The access token of the user being served, as received (with or without
   * "Bearer "). The identity server authenticates the person behind it.
   */
  userToken: string
  /** Shown on the screen and on the phone, so the person knows what they approve. */
  bindingMessage: string
  /**
   * How the person logged in to the session asking: "app" or "sim". Only a hint
   * — the identity server uses it to choose between the Auðkenni app and the
   * number saved from the person's own last SIM login. It can't send the request
   * anywhere else.
   */
  methodHint?: StepUpMethod
}

export interface CibaStartResult {
  authReqId: string
  /**
   * The method the identity server chose. Never ours to choose: it uses the way
   * the person last logged in — their verified SIM number, or else the
   * Auðkenni app — so the request only reaches their own phone.
   */
  method: StepUpMethod
  expiresIn: number
  interval: number
  /** The code shown in the Auðkenni app, for the person to compare. */
  verificationCode?: string
}

/** What the identity server vouches for once the person has approved. */
export interface StepUpClaims {
  sub: string
  nationalId: string
  acr?: string
  amr: string[]
  authTime: Date
  certificateThumbprint?: string
}

export type CibaPollResult =
  | { status: 'pending' }
  | { status: 'denied' }
  | { status: 'expired' }
  | { status: 'authenticated'; claims: StepUpClaims }
