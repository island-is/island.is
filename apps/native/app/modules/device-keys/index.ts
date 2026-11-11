import { requireOptionalNativeModule } from 'expo'
import { Platform } from 'react-native'

/**
 * - install: signs without user interaction (DPoP proofs, attestation PoP)
 * - biometric: needs a strong biometric prompt for every signature and is
 *   invalidated when the enrolled biometrics change
 */
export type DeviceKeyAlias = 'install' | 'biometric'

export type DeviceKeySecurityLevel =
  | 'secureEnclave'
  | 'strongBox'
  | 'trustedEnvironment'
  | 'software'

export interface DevicePublicJwk {
  kty: 'EC'
  crv: 'P-256'
  x: string
  y: string
}

export interface DeviceKey {
  publicJwk: DevicePublicJwk
  /** RFC 7638 JWK thumbprint (SHA-256, base64url) */
  thumbprint: string
  securityLevel: DeviceKeySecurityLevel
}

export interface GenerateDeviceKeyOptions {
  /**
   * Android only: embedded in the key attestation certificate as its UTF-8
   * bytes. Ignored on iOS, which attests through App Attest instead.
   */
  attestationChallenge?: string
}

export interface AppAttestation {
  /** The App Attest key id (base64) */
  keyId: string
  /** The attestKey result, standard base64 */
  attestationObject: string
}

export interface BiometricPromptOptions {
  title: string
  /** Android only */
  subtitle?: string
  cancel: string
}

export type DeviceKeyErrorCode =
  | 'ERR_DEVICE_KEY_CANCELLED'
  | 'ERR_DEVICE_KEY_LOCKOUT'
  // The enrolled biometrics changed since the biometric key was created.
  | 'ERR_DEVICE_KEY_INVALIDATED'
  | 'ERR_DEVICE_KEY_NOT_FOUND'
  | 'ERR_DEVICE_KEY_BIOMETRICS_UNAVAILABLE'
  | 'ERR_DEVICE_KEY_ATTESTATION_UNSUPPORTED'
  // Apple's App Attest service is down; try again later.
  | 'ERR_DEVICE_KEY_ATTESTATION_UNAVAILABLE'
  // iOS: App Attest couldn't create its key, before attesting anything.
  | 'ERR_DEVICE_KEY_ATTESTATION_KEY_FAILED'
  // The dev client was built before this module existed.
  | 'ERR_DEVICE_KEY_UNAVAILABLE'
  | 'ERR_DEVICE_KEY_FAILED'

interface DeviceKeysNativeModule {
  generateKey(
    alias: DeviceKeyAlias,
    options: GenerateDeviceKeyOptions,
  ): Promise<DeviceKey>
  getKey(alias: DeviceKeyAlias): DeviceKey | null
  deleteKey(alias: DeviceKeyAlias): void
  signWithInstallKey(data: string): Promise<string>
  signWithBiometricKey(
    data: string,
    prompt: BiometricPromptOptions,
  ): Promise<string>
  getAttestationChain(alias: DeviceKeyAlias): string[] | null
  // iOS only
  isAppAttestSupported(): boolean
  attestWithAppAttest(clientData: string): Promise<AppAttestation>
  getAppAttestKeyId(): string | null
}

// Optional so a dev client built before this module existed keeps running.
const DeviceKeys =
  requireOptionalNativeModule<DeviceKeysNativeModule>('DeviceKeys')

function deviceKeyError(code: DeviceKeyErrorCode, message: string) {
  return Object.assign(new Error(message), { code })
}

function nativeModule(): DeviceKeysNativeModule {
  if (!DeviceKeys) {
    throw deviceKeyError(
      'ERR_DEVICE_KEY_UNAVAILABLE',
      'The DeviceKeys native module is not in this build',
    )
  }
  return DeviceKeys
}

export function getDeviceKeyErrorCode(
  error: unknown,
): DeviceKeyErrorCode | undefined {
  const code = (error as { code?: unknown } | null)?.code
  return typeof code === 'string' && code.startsWith('ERR_DEVICE_KEY_')
    ? (code as DeviceKeyErrorCode)
    : undefined
}

export function isDeviceKeysAvailable(): boolean {
  return DeviceKeys !== null
}

/**
 * Creates a P-256 key in the Secure Enclave (iOS) or Keystore (Android),
 * replacing any existing key with the same alias. Falls back to a software
 * key only where no secure hardware exists (e.g. the iOS simulator), which
 * `securityLevel` reports.
 */
export function generateDeviceKey(
  alias: DeviceKeyAlias,
  options: GenerateDeviceKeyOptions = {},
): Promise<DeviceKey> {
  return nativeModule().generateKey(alias, options)
}

export function getDeviceKey(alias: DeviceKeyAlias): DeviceKey | null {
  return DeviceKeys?.getKey(alias) ?? null
}

export function deleteDeviceKey(alias: DeviceKeyAlias): void {
  DeviceKeys?.deleteKey(alias)
}

/**
 * ES256 signature over the UTF-8 bytes of `data`, as base64url r||s
 * (the JWS form, not DER).
 */
export function signWithInstallKey(data: string): Promise<string> {
  return nativeModule().signWithInstallKey(data)
}

/**
 * Shows the biometric prompt and signs like `signWithInstallKey`. Rejects
 * with ERR_DEVICE_KEY_INVALIDATED without prompting when the enrolled
 * biometrics changed since the key was created.
 */
export function signWithBiometricKey(
  data: string,
  prompt: BiometricPromptOptions,
): Promise<string> {
  return nativeModule().signWithBiometricKey(data, prompt)
}

/**
 * Android only: the key's attestation certificate chain, leaf first, as
 * standard base64 DER (the JWS `x5c` form). Null on iOS.
 */
export function getDeviceKeyAttestationChain(
  alias: DeviceKeyAlias,
): string[] | null {
  return DeviceKeys?.getAttestationChain(alias) ?? null
}

/** iOS only. False on the simulator, which attests as platform "dev". */
export function isAppAttestSupported(): boolean {
  return Platform.OS === 'ios' && (DeviceKeys?.isAppAttestSupported() ?? false)
}

/**
 * iOS only: creates an App Attest key and attests it with
 * clientDataHash = SHA-256 of the UTF-8 bytes of `clientData`. For the
 * install attestation IAS expects `<challenge>.<install key thumbprint>`.
 * The key id is kept until the install key is deleted or replaced.
 */
export async function attestWithAppAttest(
  clientData: string,
): Promise<AppAttestation> {
  if (Platform.OS !== 'ios') {
    throw deviceKeyError(
      'ERR_DEVICE_KEY_ATTESTATION_UNSUPPORTED',
      'App Attest is iOS only',
    )
  }
  return nativeModule().attestWithAppAttest(clientData)
}

/**
 * iOS only: the App Attest key attested for the current install key, for
 * App Attest assertions. Null before the first attestation.
 */
export function getAppAttestKeyId(): string | null {
  if (Platform.OS !== 'ios') {
    return null
  }
  return DeviceKeys?.getAppAttestKeyId() ?? null
}
