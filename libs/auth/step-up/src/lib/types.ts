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
   * The person's own choice, when they ask to use the other method. Without it
   * the identity server goes by how the session behind userToken was logged in.
   * "sim" only ever reaches the number saved from the person's own last SIM
   * login (and falls back to the app without one), so this can't send the
   * request anywhere else.
   */
  method?: StepUpMethod
  /**
   * A hash of exactly what is being approved. The identity server mixes it into
   * what the person's key signs and puts it back on the token, so the result can
   * be checked to be for this content and nothing else.
   */
  contextHash?: string
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
  /** Every method the person could use, so they can be offered the other one. */
  availableMethods: StepUpMethod[]
}

/** What the identity server vouches for once the person has approved. */
export interface StepUpClaims {
  sub: string
  nationalId: string
  acr?: string
  amr: string[]
  authTime: Date
  certificateThumbprint?: string
  /** The contextHash the step-up was started with, as the identity server vouches. */
  contextHash?: string
}

export type CibaPollResult =
  | { status: 'pending' }
  | { status: 'denied' }
  | { status: 'expired' }
  | { status: 'authenticated'; claims: StepUpClaims }
