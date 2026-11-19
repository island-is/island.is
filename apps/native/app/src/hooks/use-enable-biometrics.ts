import { authenticateAsync, hasHardwareAsync } from 'expo-local-authentication'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, Linking, Platform } from 'react-native'

import { getSystemIntl } from '@/components/providers/locale-provider'
import { getIasClient, isTooManyElectronicIdRequests } from '@/lib/ias'
import {
  authStore,
  isLockPastGracePeriod,
  whileSystemDialog,
} from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { isStrongBiometricsEnrolledAsync } from '@/utils/biometrics'
import { useBiometricType } from './use-biometric-type'
import { isCancelled, useElectronicIdUnlock } from './use-electronic-id-unlock'

// Straight to adding a fingerprint where the phone has that screen (Android
// 11 and later), else its security settings.
const openBiometricEnrollment = () =>
  Linking.sendIntent('android.settings.BIOMETRIC_ENROLL').catch(() =>
    Linking.sendIntent('android.settings.SECURITY_SETTINGS'),
  )

/**
 * Turns on biometric unlock for a native login. The person approves it with
 * electronic ID in its own request, and the tokens from that approval register
 * a new biometric key with IAS. A failure is shown in an alert.
 */
export function useEnableBiometrics({
  inline = false,
}: {
  /**
   * The caller shows the electronic ID approval in place of its own screen
   * (`verificationCode`), rather than in a sheet.
   */
  inline?: boolean
} = {}) {
  const intl = useIntl()
  const { authenticationTypes } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)
  const [isEnabling, setIsEnabling] = useState(false)
  const electronicId = useElectronicIdUnlock('enableBiometrics', { inline })
  // Counts the attempts. A newer one, cancel() or leaving the screen stops an
  // earlier one before it starts electronic ID or uses its answer: the checks
  // before electronic ID leave a moment to skip the step.
  const attempt = useRef(0)
  useEffect(
    () => () => {
      attempt.current++
    },
    [],
  )

  /**
   * Says where to set biometrics up on a phone that has none yet. iOS can't
   * open its Face ID settings, so it only says so.
   */
  const showNotEnrolledAlert = () => {
    if (Platform.OS === 'android') {
      Alert.alert(
        intl.formatMessage({ id: 'biometrics.notEnrolledTitle.android' }),
        intl.formatMessage({ id: 'onboarding.biometrics.strongNotEnrolled' }),
        [
          {
            text: intl.formatMessage({ id: 'biometrics.notNow' }),
            style: 'cancel',
          },
          {
            text: intl.formatMessage({ id: 'biometrics.openSettings' }),
            onPress: () => void openBiometricEnrollment(),
          },
        ],
      )
    } else {
      Alert.alert(
        intl.formatMessage({ id: 'biometrics.notEnrolledTitle' }),
        intl.formatMessage(
          { id: 'biometrics.notEnrolledMessage.ios' },
          { biometricType: biometricType.text },
        ),
        [{ text: intl.formatMessage({ id: 'biometrics.close' }) }],
      )
    }
  }

  /**
   * iOS asks to allow Face ID the first time an app uses it. Using it once
   * here asks while the person turns it on, not later at the lock, and a
   * refusal stops before the electronic ID request. Android doesn't ask.
   */
  const confirmBiometrics = async (): Promise<boolean> => {
    if (Platform.OS !== 'ios') {
      return true
    }
    const result = await whileSystemDialog(() =>
      authenticateAsync({
        promptMessage: 'Ísland.is',
        // The system's dialog: its own text is in the phone's language.
        cancelLabel: getSystemIntl().formatMessage({ id: 'biometrics.close' }),
        disableDeviceFallback: true,
        fallbackLabel: '',
      }),
    )
    if (result.success) {
      return true
    }

    if (result.error === 'not_available') {
      // What iOS says once the person has turned it off for the app.
      Alert.alert(
        intl.formatMessage(
          { id: 'biometrics.turnedOffTitle' },
          { biometricType: biometricType.text },
        ),
        intl.formatMessage(
          { id: 'biometrics.turnedOffMessage' },
          { biometricType: biometricType.text },
        ),
        [
          {
            text: intl.formatMessage({ id: 'biometrics.notNow' }),
            style: 'cancel',
          },
          {
            text: intl.formatMessage({ id: 'biometrics.openSettings' }),
            isPreferred: true,
            onPress: () => void Linking.openSettings(),
          },
        ],
      )
    } else if (result.error === 'not_enrolled') {
      showNotEnrolledAlert()
    } else if (
      result.error !== 'user_cancel' &&
      result.error !== 'system_cancel' &&
      result.error !== 'app_cancel'
    ) {
      Alert.alert(
        intl.formatMessage(
          { id: 'biometrics.enableFailedTitle' },
          { biometricType: biometricType.text },
        ),
        intl.formatMessage({ id: 'electronicId.error.tryAgain' }),
      )
    }
    return false
  }

  /** Resolves with whether biometrics are on. */
  const enableBiometrics = async (): Promise<boolean> => {
    if (electronicId.isPending()) {
      return false
    }
    const current = ++attempt.current
    const isCurrent = () => attempt.current === current
    setIsEnabling(true)
    let enabled = false
    try {
      // Not when it's turned off for the app on iOS: then it has no hardware
      // either, and confirmBiometrics() says where to turn it on.
      const isNotEnrolled =
        (await hasHardwareAsync()) && !(await isStrongBiometricsEnrolledAsync())
      if (!isCurrent()) {
        return false
      }
      if (isNotEnrolled) {
        showNotEnrolledAlert()
        return false
      }
      if (!(await confirmBiometrics()) || !isCurrent()) {
        return false
      }
      const tokens = await electronicId.unlock()
      if (!isCurrent()) {
        return false
      }
      // As with an unlock, the earlier refresh token stops working, so these
      // replace the tokens. Approved after the app locked for good, they only
      // register the key: the lock gets new ones, and the dead ones go now.
      if (isLockPastGracePeriod()) {
        void authStore.getState().lockNative()
      } else {
        authStore.getState().unlockNative(tokens)
      }
      await getIasClient().enableBiometrics(tokens.accessToken)
      enabled = true
      return true
    } catch (error) {
      if (!isCancelled(error) && isCurrent()) {
        console.warn('Enabling biometrics failed', error)
        Alert.alert(
          intl.formatMessage(
            { id: 'biometrics.enableFailedTitle' },
            { biometricType: biometricType.text },
          ),
          intl.formatMessage({
            id: isTooManyElectronicIdRequests(error)
              ? 'electronicId.error.tooManyRequests'
              : 'electronicId.error.tryAgain',
          }),
        )
      }
      return false
    } finally {
      // In place, the code stays up after a success while the caller moves
      // on. A sheet closes, and so does either one if registering failed.
      if (!enabled || !inline) {
        electronicId.close()
      }
      setIsEnabling(false)
    }
  }

  /** Stops an attempt in progress, e.g. when the person skips the step. */
  const cancel = () => {
    attempt.current++
    electronicId.cancel()
  }

  return {
    isEnabling,
    enableBiometrics,
    cancel,
    /** With `inline`: shown while electronic ID waits. */
    verificationCode: electronicId.verificationCode,
    cancelElectronicId: electronicId.cancel,
  }
}
