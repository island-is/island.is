import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'

import { getDeviceKeyErrorCode } from '../../modules/device-keys'
import type { ElectronicIdError } from '@/components/device-bound-auth/device-lock'
import {
  getIasClient,
  getIasErrorCode,
  isAppLoginRemoved,
  isBiometricKeyInvalidated,
  isTooManyElectronicIdRequests,
} from '@/lib/ias'
import { authStore } from '@/stores/auth-store'
import { isCancelled, useElectronicIdUnlock } from './use-electronic-id-unlock'

export type NativeUnlockStatus =
  | 'idle'
  | 'prompting'
  | 'failed'
  | 'electronicId'

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
  const electronicId = useElectronicIdUnlock('unlock')
  const ias = getIasClient()

  const unlockWithBiometrics = async () => {
    if (!ias.isBiometricsEnabled() || electronicId.isPending()) {
      return
    }
    setElectronicIdError(undefined)
    setStatus('prompting')
    try {
      const tokens = await ias.unlockWithBiometrics({
        title: 'Ísland.is',
        cancel: intl.formatMessage({
          id: 'applock.useElectronicId',
          defaultMessage: 'Use electronic ID',
        }),
      })
      authStore.getState().unlockNative(tokens)
      setStatus('idle')
      onUnlocked()
    } catch (error) {
      if (isAppLoginGone(error)) {
        onAppLoginGone()
        return
      }
      if (getDeviceKeyErrorCode(error) === 'ERR_DEVICE_KEY_CANCELLED') {
        setStatus('idle')
        return
      }
      if (isBiometricKeyInvalidated(error)) {
        // The client turned biometrics off. Same message as the PIN lock's.
        Alert.alert(
          intl.formatMessage({ id: 'biometrics.enrollmentChanged.title' }),
          intl.formatMessage({ id: 'biometrics.enrollmentChanged.message' }),
        )
        setStatus('idle')
        return
      }
      // Lockout, or IAS refused the key: electronic ID still works.
      console.warn('Biometric unlock failed', error)
      setStatus('failed')
    }
  }

  const unlockWithElectronicId = async () => {
    if (electronicId.isPending()) {
      return
    }
    setElectronicIdError(undefined)
    setStatus('electronicId')
    try {
      authStore.getState().unlockNative(await electronicId.unlock())
      setStatus('idle')
      // Closes the lock along with the sheet on top of it.
      onUnlocked()
    } catch (error) {
      if (isAppLoginGone(error)) {
        onAppLoginGone()
        return
      }
      if (!isCancelled(error)) {
        console.warn('Electronic ID unlock failed', error)
        setElectronicIdError(
          isTooManyElectronicIdRequests(error) ? 'tooManyRequests' : 'failed',
        )
      }
      setStatus('idle')
    }
  }

  return {
    status,
    /** Why the last electronic ID attempt failed; cleared on the next try. */
    electronicIdError,
    isBiometricsEnabled: ias.isBiometricsEnabled(),
    unlockWithBiometrics,
    unlockWithElectronicId,
  }
}
