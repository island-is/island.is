import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, AppState } from 'react-native'

import { getDeviceKeyErrorCode } from '../../modules/device-keys'
import type { ElectronicIdError } from '@/components/device-bound-auth/device-lock'
import {
  getIasClient,
  getIasErrorCode,
  isAppLoginRemoved,
  isBiometricKeyInvalidated,
  isIasUnreachable,
  isTooManyElectronicIdRequests,
} from '@/lib/ias'
import { getSystemIntl } from '@/components/providers/locale-provider'
import { authStore } from '@/stores/auth-store'
import { isCancelled, useElectronicIdUnlock } from './use-electronic-id-unlock'

export type NativeUnlockStatus =
  | 'idle'
  | 'prompting'
  | 'failed'
  // Too many failed attempts: the phone has turned biometrics off for now.
  | 'lockedOut'
  | 'electronicId'

// How long Android's temporary lockout lasts.
const TEMPORARY_LOCKOUT_MS = 30_000

/** IAS no longer has the app login: logged out elsewhere, or idle too long. */
const isAppLoginGone = (error: unknown) =>
  isAppLoginRemoved(error) || getIasErrorCode(error) === 'unknown_user_id'

/**
 * Unlocks a native login: biometrics with the device key, or electronic ID
 * with a verification code. Either way the app gets new tokens.
 */
export function useNativeUnlock({
  onUnlocked,
  onAppLoginGone,
}: {
  onUnlocked(): void
  /** The person has to log in again. */
  onAppLoginGone(): void
}) {
  const intl = useIntl()
  const [status, setStatus] = useState<NativeUnlockStatus>('idle')
  const [electronicIdError, setElectronicIdError] =
    useState<ElectronicIdError>()
  // The phone can be on a network that doesn't get through, e.g. a wifi
  // without internet: only the request knows.
  const [isUnreachable, setIsUnreachable] = useState(false)
  // Shown by the lock in place of itself: a screen pushed over the lock,
  // itself a modal, would end up behind it.
  const electronicId = useElectronicIdUnlock('unlock', { inline: true })
  const ias = getIasClient()
  const lockoutTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  // Outlasts the electronic ID tried meanwhile, which has its own status.
  const isLockedOut = useRef(false)
  // Where electronic ID leaves the lock when it doesn't open the app.
  const statusAfterElectronicId = () =>
    isLockedOut.current ? 'lockedOut' : 'idle'
  // A native key read: once, and again after an unlock may have changed it.
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(() =>
    ias.isBiometricsEnabled(),
  )
  // The auto-prompt and a tap can come together.
  const isUnlockingWithBiometrics = useRef(false)
  // Logging out from the lock while an unlock is out leaves nothing to open,
  // also while the logout is still running, or once someone else logged in.
  const watchSession = () => {
    const { session } = authStore.getState()
    return () => {
      const state = authStore.getState()
      return state.session === session && !!state.nativeUser
    }
  }

  // Biometrics are offered again once the lockout may be over: the phone was
  // unlocked with its passcode while the app was away, or Android's 30
  // seconds have passed. If it isn't, a tap says so without a prompt.
  const endLockout = () => {
    clearTimeout(lockoutTimer.current)
    isLockedOut.current = false
    setStatus((current) => (current === 'lockedOut' ? 'idle' : current))
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        endLockout()
      }
    })
    return () => {
      subscription.remove()
      clearTimeout(lockoutTimer.current)
    }
  }, [])

  const unlockWithBiometrics = async () => {
    if (
      isUnlockingWithBiometrics.current ||
      !ias.isBiometricsEnabled() ||
      electronicId.isPending()
    ) {
      return
    }
    isUnlockingWithBiometrics.current = true
    const isCurrent = watchSession()
    setElectronicIdError(undefined)
    setIsUnreachable(false)
    setStatus('prompting')
    try {
      const tokens = await ias.unlockWithBiometrics({
        title: 'Ísland.is',
        // The system's dialog: its own text is in the phone's language.
        cancel: getSystemIntl().formatMessage({ id: 'biometrics.close' }),
      })
      if (!isCurrent()) {
        return
      }
      authStore.getState().unlockNative(tokens)
      setStatus('idle')
      onUnlocked()
    } catch (error) {
      if (!isCurrent()) {
        return
      }
      if (isAppLoginGone(error)) {
        onAppLoginGone()
        return
      }
      if (getDeviceKeyErrorCode(error) === 'ERR_DEVICE_KEY_CANCELLED') {
        setStatus('idle')
        return
      }
      if (isBiometricKeyInvalidated(error)) {
        // The client turned biometrics off.
        Alert.alert(
          intl.formatMessage({ id: 'biometrics.enrollmentChanged.title' }),
          intl.formatMessage({ id: 'biometrics.enrollmentChanged.message' }),
        )
        setStatus('idle')
        return
      }
      const code = getDeviceKeyErrorCode(error)
      if (
        code === 'ERR_DEVICE_KEY_LOCKOUT' ||
        code === 'ERR_DEVICE_KEY_LOCKOUT_TEMPORARY'
      ) {
        isLockedOut.current = true
        setStatus('lockedOut')
        if (code === 'ERR_DEVICE_KEY_LOCKOUT_TEMPORARY') {
          lockoutTimer.current = setTimeout(endLockout, TEMPORARY_LOCKOUT_MS)
        }
        return
      }
      if (isIasUnreachable(error)) {
        setIsUnreachable(true)
        setStatus('idle')
        return
      }
      // IAS refused the key, or anything else: electronic ID still works.
      console.warn('Biometric unlock failed', error)
      setStatus('failed')
    } finally {
      isUnlockingWithBiometrics.current = false
      // An invalidated key is gone now.
      setIsBiometricsEnabled(ias.isBiometricsEnabled())
    }
  }

  const unlockWithElectronicId = async () => {
    if (electronicId.isPending()) {
      return
    }
    const isCurrent = watchSession()
    setElectronicIdError(undefined)
    setIsUnreachable(false)
    setStatus('electronicId')
    try {
      const tokens = await electronicId.unlock()
      if (!isCurrent()) {
        return
      }
      authStore.getState().unlockNative(tokens)
      setStatus('idle')
      // Approved while the app is away: the lock stays until it's back, so
      // the code goes now. In front, it stays up as the lock closes.
      if (AppState.currentState === 'background') {
        electronicId.close()
      }
      // Closes the lock along with the sheet on top of it.
      onUnlocked()
    } catch (error) {
      if (!isCurrent()) {
        return
      }
      if (isAppLoginGone(error)) {
        onAppLoginGone()
        return
      }
      if (isIasUnreachable(error)) {
        setIsUnreachable(true)
      } else if (!isCancelled(error)) {
        console.warn('Electronic ID unlock failed', error)
        setElectronicIdError(
          isTooManyElectronicIdRequests(error) ? 'tooManyRequests' : 'failed',
        )
      }
      setStatus(statusAfterElectronicId())
    }
  }

  return {
    status,
    /** Why the last electronic ID attempt failed; cleared on the next try. */
    electronicIdError,
    /** The last try didn't reach IAS; cleared on the next try. */
    isUnreachable,
    isBiometricsEnabled,
    /** Shown while electronic ID waits; undefined until IAS sends it. */
    verificationCode: electronicId.verificationCode,
    unlockWithBiometrics,
    unlockWithElectronicId,
    cancelElectronicId: electronicId.cancel,
  }
}
