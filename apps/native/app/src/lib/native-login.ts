import { create, useStore } from 'zustand'

import type { LoginMethod } from '@/components/device-bound-auth/login-identifier'
import {
  getIasClient,
  getIasErrorCode,
  IasError,
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
 * - `failed`: anything else
 */
export type LoginError =
  | 'newLoginRestricted'
  | 'tooManyRequests'
  | 'wrongSmsCode'
  | 'smsCodeAttemptsUsed'
  | 'declined'
  | 'expired'
  | 'failed'

/** The message for each error. `wrongSmsCode` takes `attemptsLeft`. */
export const loginErrorMessageId: Record<LoginError, string> = {
  newLoginRestricted: 'login.error.newLoginRestricted',
  tooManyRequests: 'electronicId.error.tooManyRequests',
  wrongSmsCode: 'login.error.wrongSmsCode',
  smsCodeAttemptsUsed: 'login.error.smsCodeAttemptsUsed',
  declined: 'login.error.declined',
  expired: 'login.error.expired',
  failed: 'login.error.failed',
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
  if (code === 'access_denied') {
    return 'declined'
  }
  if (code === 'expired_token') {
    return 'expired'
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

export type StartLoginResult =
  | { next: 'confirm' | 'smsCode' }
  | { error: LoginError; attemptsLeft?: number }

/**
 * Starts the electronic ID login for the number in the store. Next is the
 * confirmation, or the SMS code screen when IAS sent one first.
 */
export async function startNativeLogin({
  smsCode,
}: { smsCode?: string } = {}): Promise<StartLoginResult> {
  const { loginHint } = nativeLoginStore.getState()
  try {
    const request = await getIasClient().startLogin(loginHint, { smsCode })
    nativeLoginStore.setState({ request })
    return { next: 'confirm' }
  } catch (error) {
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
