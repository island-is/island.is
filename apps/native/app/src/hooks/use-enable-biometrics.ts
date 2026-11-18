import {
  authenticateAsync,
  hasHardwareAsync,
  isEnrolledAsync,
} from 'expo-local-authentication'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, Linking, Platform } from 'react-native'

import { getSystemIntl } from '@/components/providers/locale-provider'
import { getIasClient, isTooManyElectronicIdRequests } from '@/lib/ias'
import { authStore, whileSystemDialog } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
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

  /**
   * Says where to set biometrics up on a phone that has none yet. iOS can't
   * open its Face ID settings, so it only says so.
   */
  const showNotEnrolledAlert = () => {
    const title = intl.formatMessage({ id: 'biometrics.notEnrolledTitle' })
    if (Platform.OS === 'android') {
      Alert.alert(
        title,
        intl.formatMessage({ id: 'biometrics.notEnrolledMessage.android' }),
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
        title,
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
    setIsEnabling(true)
    let enabled = false
    try {
      // Not when it's turned off for the app on iOS: then it has no hardware
      // either, and confirmBiometrics() says where to turn it on.
      if ((await hasHardwareAsync()) && !(await isEnrolledAsync())) {
        showNotEnrolledAlert()
        return false
      }
      if (!(await confirmBiometrics())) {
        return false
      }
      const tokens = await electronicId.unlock()
      // As with an unlock, the earlier refresh token stops working.
      authStore.getState().unlockNative(tokens)
      await getIasClient().enableBiometrics(tokens.accessToken)
      enabled = true
      return true
    } catch (error) {
      if (!isCancelled(error)) {
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

  return {
    isEnabling,
    enableBiometrics,
    /** With `inline`: shown while electronic ID waits. */
    verificationCode: electronicId.verificationCode,
    cancelElectronicId: electronicId.cancel,
  }
}
