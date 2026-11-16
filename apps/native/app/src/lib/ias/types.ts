import type {
  BiometricPromptOptions,
  DeviceKey,
} from '../../../modules/device-keys'

/**
 * The app's side of native login against IAS. The contract is
 * doc/native-app-auth.md in identity-server.web.
 *
 * The client keeps the install's attestation, never the tokens: the auth
 * store owns those.
 */
export interface IasClient {
  /** The install key's thumbprint. Null before the first login. */
  getInstallThumbprint(): string | null

  /**
   * Starts an electronic ID login with a phone number (SIM) or kennitala
   * (Auðkennisapp). Rejects with `sms_code_required` when IAS sent an SMS
   * code: ask for it and start again with the same hint and `smsCode`.
   */
  startLogin(
    loginHint: string,
    options?: { smsCode?: string },
  ): Promise<CibaRequest>
  /**
   * Electronic ID unlock: IAS finds the person from the install. With
   * `purpose: 'biometric-key'` the person approves turning on biometrics
   * instead, and the tokens can register a biometric key.
   */
  startElectronicIdUnlock(options?: {
    purpose?: 'biometric-key'
  }): Promise<CibaRequest>
  /** Polls until the person approves on their phone, declines or it expires. */
  waitForApproval(
    request: CibaRequest,
    options?: { signal?: AbortSignal },
  ): Promise<IasTokens>

  isBiometricsEnabled(): boolean
  /**
   * With the access token from an electronic ID approval for biometrics,
   * within 10 minutes of it. One approval enables one key.
   */
  enableBiometrics(accessToken: string): Promise<void>
  disableBiometrics(): Promise<void>
  /**
   * Shows the biometric prompt. After a biometric enrolment change it fails
   * without one (isBiometricKeyInvalidated), and biometrics are off.
   */
  unlockWithBiometrics(prompt: BiometricPromptOptions): Promise<IasTokens>

  refresh(refreshToken: string): Promise<IasTokens>
  /** On lock, before the tokens are deleted. */
  revoke(refreshToken: string): Promise<void>
  /** Removes the app login on IAS and the biometric key. */
  logout(refreshToken?: string): Promise<void>

  /**
   * The `DPoP` header for an API request sent with
   * `Authorization: DPoP <accessToken>`.
   */
  createDpopProof(
    method: string,
    url: string,
    accessToken: string,
  ): Promise<string>
}

export interface CibaRequest {
  authReqId: string
  /** Öryggistala, shown while the person approves */
  verificationCode: string
  loginMethod: 'sim' | 'app'
  /** Seconds */
  expiresIn: number
  /** Seconds between polls */
  interval: number
}

/** Shaped like react-native-app-auth's results, for the auth store. */
export interface IasTokens {
  accessToken: string
  /** ISO 8601 */
  accessTokenExpirationDate: string
  refreshToken: string
  idToken: string
  tokenType: 'DPoP'
  scopes: string[]
}

/** What the client needs from the device: keys, attestation and hashing. */
export interface IasDevice {
  /** Android puts the attestation challenge in the key's certificate. */
  os: 'ios' | 'android'
  getInstallKey(): DeviceKey | null
  /**
   * Replaces the install key. Android embeds the attestation challenge in
   * the key's certificate, so it must be passed here.
   */
  generateInstallKey(attestationChallenge?: string): Promise<DeviceKey>
  /** The platform evidence for POST /app/attestation. */
  attestInstallKey(
    key: DeviceKey,
    challenge: string,
  ): Promise<AttestationEvidence>
  signWithInstallKey(data: string): Promise<string>

  getBiometricKey(): DeviceKey | null
  generateBiometricKey(attestationChallenge?: string): Promise<DeviceKey>
  /** Android only: the biometric key's attestation certificate chain. */
  getBiometricKeyAttestationChain(): string[] | null
  signWithBiometricKey(
    data: string,
    prompt: BiometricPromptOptions,
  ): Promise<string>
  deleteBiometricKey(): void

  /** SHA-256 of the UTF-8 bytes of `data`, base64url */
  sha256(data: string): Promise<string>
  randomUUID(): string
}

export type AttestationEvidence =
  | { platform: 'apple'; keyId: string; attestationObject: string }
  | { platform: 'android'; certificateChain: string[] }
  // Simulators and emulators: software keys, no evidence
  | { platform: 'dev' }

/** Where the client keeps the install's client attestation. */
export interface IasStorage {
  getAttestation(): Promise<StoredAttestation | null>
  setAttestation(attestation: StoredAttestation): Promise<void>
}

export interface StoredAttestation {
  /** What it was issued for: switching environments needs a new one. */
  issuer: string
  clientId: string
  /** The install key it was issued for */
  thumbprint: string
  clientAttestation: string
  /** Epoch milliseconds */
  expiresAt: number
}
