import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'

import { getDeviceKeyErrorCode } from '../../modules/device-keys'
import {
  getIasClient,
  getIasErrorCode,
  isAppLoginRemoved,
  isBiometricKeyInvalidated,
} from '@/lib/ias'
import { authStore } from '@/stores/auth-store'

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
  const [verificationCode, setVerificationCode] = useState<string>()
  const electronicIdRef = useRef<AbortController | undefined>(undefined)
  const ias = getIasClient()

  const unlockWithBiometrics = async () => {
    if (!ias.isBiometricsEnabled() || electronicIdRef.current) {
      return
    }
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
    if (electronicIdRef.current) {
      return
    }
    const controller = new AbortController()
    electronicIdRef.current = controller
    setStatus('electronicId')
    try {
      const request = await ias.startElectronicIdUnlock()
      setVerificationCode(request.verificationCode)
      const tokens = await ias.waitForApproval(request, {
        signal: controller.signal,
      })
      authStore.getState().unlockNative(tokens)
      setStatus('idle')
      onUnlocked()
    } catch (error) {
      if (isAppLoginGone(error)) {
        onAppLoginGone()
        return
      }
      if (!controller.signal.aborted) {
        console.warn('Electronic ID unlock failed', error)
      }
      setStatus('idle')
    } finally {
      electronicIdRef.current = undefined
      setVerificationCode(undefined)
    }
  }

  const cancelElectronicId = () => {
    electronicIdRef.current?.abort()
  }

  return {
    status,
    isBiometricsEnabled: ias.isBiometricsEnabled(),
    /** Shown while electronic ID waits; undefined until IAS sends it. */
    verificationCode,
    unlockWithBiometrics,
    unlockWithElectronicId,
    cancelElectronicId,
  }
}
