import type { DeviceKeyErrorCode } from '../../../modules/device-keys'

/**
 * IAS puts some reasons at the start of `error_description` (on /connect/*)
 * instead of in `error`, e.g. "sms_code_required: …". These become the code.
 */
const DESCRIPTION_REASONS = [
  'sms_code_required',
  'invalid_sms_code',
  'new_login_restricted',
  'too_many_requests',
] as const

export type IasErrorCode =
  | typeof DESCRIPTION_REASONS[number]
  // CIBA
  | 'authorization_pending'
  | 'slow_down'
  | 'access_denied'
  | 'expired_token'
  | 'unknown_user_id'
  // Attestation, unlock and biometric registration
  | 'invalid_client'
  | 'invalid_grant'
  | 'invalid_request'
  | 'invalid_attestation'
  | 'invalid_token'
  | 'insufficient_user_authentication'
  | 'unauthorized_client'
  | 'invalid_dpop_proof'
  | 'use_dpop_nonce'
  | 'use_attestation_challenge'

export class IasError extends Error {
  /** The reason from `error_description` when there is one, else `error` */
  readonly code: IasErrorCode | (string & {})

  constructor(
    /** The OAuth `error` */
    readonly error: string,
    readonly description: string | undefined,
    readonly status: number,
    /** e.g. "POST /connect/ciba" */
    readonly endpoint: string,
  ) {
    super(
      `${endpoint}: ${status} ${error}${description ? ` ${description}` : ''}`,
    )
    this.name = 'IasError'
    this.code =
      DESCRIPTION_REASONS.find(
        (reason) =>
          description === reason || description?.startsWith(`${reason}:`),
      ) ?? error
  }
}

export function getIasErrorCode(
  error: unknown,
): IasErrorCode | (string & {}) | undefined {
  return error instanceof IasError ? error.code : undefined
}

/**
 * The install has no app login any more (renewal refused), so the session
 * is gone and the person logs in again.
 */
export function isAppLoginRemoved(error: unknown) {
  return (
    error instanceof IasError &&
    error.endpoint === 'POST /app/attestation/renew' &&
    error.code === 'invalid_grant'
  )
}

/**
 * IAS no longer knows the attestation challenge: it expired, e.g. while the
 * app was in the background, or was used already. A new one works.
 */
export function isAttestationChallengeUnknown(error: unknown) {
  return (
    error instanceof IasError &&
    error.endpoint === 'POST /app/attestation' &&
    error.code === 'invalid_grant'
  )
}

/** Why the phone couldn't attest its install key: the codes IAS counts. */
export type AttestationFailureReason =
  | 'not_supported'
  | 'generate_key_failed'
  | 'attest_key_failed'
  | 'server_unavailable'
  | 'key_generation_failed'
  | 'no_certificate_chain'
  | 'unknown'

/** The phone couldn't attest its install key, so IAS was never asked. */
export class DeviceAttestationError extends Error {
  constructor(
    readonly reason: AttestationFailureReason,
    /** The device key error behind it, if any */
    readonly cause?: unknown,
  ) {
    super(
      `The phone couldn't attest: ${reason}${
        cause instanceof Error ? ` (${cause.message})` : ''
      }`,
    )
    this.name = 'DeviceAttestationError'
  }
}

/**
 * The phone can't be trusted with a login: it couldn't attest its install
 * key, or IAS refused the attestation, e.g. for an unlocked bootloader.
 */
export function isDeviceNotAttested(error: unknown) {
  return (
    error instanceof DeviceAttestationError ||
    (error instanceof IasError &&
      error.endpoint === 'POST /app/attestation' &&
      error.code === 'invalid_attestation')
  )
}

/** iOS: Apple's App Attest service is down. It works again later. */
export function isAppAttestUnavailable(error: unknown) {
  return (
    error instanceof DeviceAttestationError &&
    error.reason === 'server_unavailable'
  )
}

/**
 * IAS refused an electronic ID request over a limit: requests per install,
 * logins per phone number or kennitala, SMS codes per number, or requests
 * still waiting for an answer. Nothing was sent.
 */
export function isTooManyElectronicIdRequests(error: unknown) {
  return getIasErrorCode(error) === 'too_many_requests'
}

/**
 * The enrolled biometrics changed, so the biometric key can never sign
 * again. The client deletes it: biometrics are off until enabled again.
 */
export function isBiometricKeyInvalidated(error: unknown) {
  const code: DeviceKeyErrorCode = 'ERR_DEVICE_KEY_INVALIDATED'
  return (error as { code?: unknown } | null)?.code === code
}
