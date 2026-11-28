import { create, useStore } from 'zustand'

import type { LoginMethod } from '@/components/device-bound-auth/login-identifier'
import {
  getIasClient,
  getIasErrorCode,
  IasError,
  isAppAttestUnavailable,
  isDeviceNotAttested,
  isIasUnreachable,
  isTooManyElectronicIdRequests,
} from '@/lib/ias'
import type { CibaRequest } from '@/lib/ias'

/** IAS's SMS codes for a login on a new device */
export const SMS_CODE_LENGTH = 3

/**
 * Why a native login stopped:
 * - `newLoginRestricted`: the person doesn't allow logins on new devices
 * - `tooManyRequests`: IAS allows only a few requests in a short time
 * - `wrongSmsCode`: the SMS code was wrong; some attempts are left
 * - `smsCodeAttemptsUsed`: the SMS code was wrong too often; start again
 * - `declined`: Auðkenni refused it, e.g. for a number without electronic
 *   ID, or it was declined on the phone: IAS can't tell those apart, and
 *   says the user wasn't found
 * - `expired`: nobody answered in time
 * - `deviceCheckUnavailable`: iOS: Apple's App Attest service is down, so
 *   the phone can't be attested for now
 * - `unsupportedDevice`: the phone couldn't attest, or IAS refused it
 * - `noConnection`: the request didn't reach IAS, also on a network where
 *   nothing gets through
 * - `failed`: anything else
 */
export type LoginError =
  | 'newLoginRestricted'
  | 'tooManyRequests'
  | 'wrongSmsCode'
  | 'smsCodeAttemptsUsed'
  | 'declined'
  | 'expired'
  | 'deviceCheckUnavailable'
  | 'unsupportedDevice'
  | 'noConnection'
  | 'failed'

/** The message for each error. `wrongSmsCode` takes `attemptsLeft`. */
export const loginErrorMessageId: Record<LoginError, string> = {
  newLoginRestricted: 'login.error.newLoginRestricted',
  tooManyRequests: 'electronicId.error.tooManyRequests',
  wrongSmsCode: 'login.error.wrongSmsCode',
  smsCodeAttemptsUsed: 'login.error.smsCodeAttemptsUsed',
  declined: 'login.error.declined',
  expired: 'login.error.expired',
  deviceCheckUnavailable: 'login.error.deviceCheckUnavailable',
  unsupportedDevice: 'login.error.unsupportedDevice',
  noConnection: 'offline.loginMessage',
  failed: 'login.error.failed',
}

/** A bold title above the message, for the errors that have one. */
export const loginErrorTitleId: Partial<Record<LoginError, string>> = {
  unsupportedDevice: 'login.error.unsupportedDeviceTitle',
  noConnection: 'offline.title',
}

interface NativeLoginStore {
  method: LoginMethod
  /** Digits only: a phone number for SIM, a kennitala for the app */
  loginHint: string
  /** The request the confirmation waits on */
  request?: CibaRequest
  /** Why the last attempt stopped, for the number screen to show */
  error?: LoginError
}

/** The login flow's state, shared between its screens. */
export const nativeLoginStore = create<NativeLoginStore>(() => ({
  method: 'sim',
  loginHint: '',
}))

export const useNativeLoginStore = <U = NativeLoginStore>(
  selector?: (state: NativeLoginStore) => U,
) => useStore(nativeLoginStore, selector!)

export function toLoginError(error: unknown): LoginError {
  const code = getIasErrorCode(error)
  if (code === 'new_login_restricted') {
    return 'newLoginRestricted'
  }
  if (isTooManyElectronicIdRequests(error)) {
    return 'tooManyRequests'
  }
  // unknown_user_id: IAS can say outright that it doesn't know the person.
  if (code === 'access_denied' || code === 'unknown_user_id') {
    return 'declined'
  }
  if (code === 'expired_token') {
    return 'expired'
  }
  if (isAppAttestUnavailable(error)) {
    return 'deviceCheckUnavailable'
  }
  if (isDeviceNotAttested(error)) {
    return 'unsupportedDevice'
  }
  if (isIasUnreachable(error)) {
    return 'noConnection'
  }
  return 'failed'
}

// "invalid_sms_code: 2 attempts remaining"
function smsAttemptsLeft(error: unknown) {
  const match =
    error instanceof IasError
      ? /(\d+) attempts? remaining/.exec(error.description ?? '')
      : null
  return match ? Number(match[1]) : 0
}

/** `superseded`: a later start replaced this one, which leaves things be. */
export type StartLoginResult =
  | { next: 'confirm' | 'smsCode' }
  | { error: LoginError; attemptsLeft?: number }
  | { superseded: true }

// The latest start: one from before it that answers last doesn't replace its
// request.
let latestStart = 0

/**
 * Starts the electronic ID login for the number in the store. Next is the
 * confirmation, or the SMS code screen when IAS sent one first.
 */
export async function startNativeLogin({
  smsCode,
}: { smsCode?: string } = {}): Promise<StartLoginResult> {
  const start = ++latestStart
  const { loginHint } = nativeLoginStore.getState()
  try {
    const request = await getIasClient().startLogin(loginHint, { smsCode })
    if (start !== latestStart) {
      return { superseded: true }
    }
    nativeLoginStore.setState({ request })
    return { next: 'confirm' }
  } catch (error) {
    if (start !== latestStart) {
      return { superseded: true }
    }
    const code = getIasErrorCode(error)
    if (code === 'sms_code_required') {
      return { next: 'smsCode' }
    }
    if (code === 'invalid_sms_code') {
      const attemptsLeft = smsAttemptsLeft(error)
      return attemptsLeft > 0
        ? { error: 'wrongSmsCode', attemptsLeft }
        : { error: 'smsCodeAttemptsUsed' }
    }
    console.warn('Native login failed', error)
    return { error: toLoginError(error) }
  }
}
