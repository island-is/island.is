import type { DeviceKeyErrorCode } from '../../../modules/device-keys'

/**
 * IAS puts some reasons at the start of `error_description` (on /connect/*)
 * instead of in `error`, e.g. "sms_code_required: …". These become the code.
 */
const DESCRIPTION_REASONS = [
  'native_login_disabled',
  'sms_code_required',
  'invalid_sms_code',
  'new_login_restricted',
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

/** IAS's kill switch is on: use the browser login. Refresh still works. */
export function isNativeLoginDisabled(error: unknown) {
  return getIasErrorCode(error) === 'native_login_disabled'
}

/**
 * The install has no app login any more (renewal refused), so the session
 * is gone: show screen A.
 */
export function isAppLoginRemoved(error: unknown) {
  return (
    error instanceof IasError &&
    error.endpoint === 'POST /app/attestation/renew' &&
    error.code === 'invalid_grant'
  )
}

/**
 * The enrolled biometrics changed, so the biometric key can never sign
 * again. The client deletes it: biometrics are off until enabled again.
 */
export function isBiometricKeyInvalidated(error: unknown) {
  const code: DeviceKeyErrorCode = 'ERR_DEVICE_KEY_INVALIDATED'
  return (error as { code?: unknown } | null)?.code === code
}
