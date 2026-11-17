import { authenticateAsync } from 'expo-local-authentication'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, Linking, Platform } from 'react-native'

import { getSystemIntl } from '@/components/providers/locale-provider'
import { getIasClient, isTooManyElectronicIdRequests } from '@/lib/ias'
import { authStore, whileSystemDialog } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { useBiometricType } from './use-biometric-type'
import { isCancelled, useElectronicIdUnlock } from './use-electronic-id-unlock'

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

    const title = intl.formatMessage(
      { id: 'biometrics.enableFailedTitle' },
      { biometricType: biometricType.text },
    )
    if (result.error === 'not_available') {
      // What iOS says once the person hasn't allowed it for the app.
      Alert.alert(
        title,
        intl.formatMessage(
          { id: 'biometrics.notAllowedMessage' },
          { biometricType: biometricType.text },
        ),
        [
          {
            text: intl.formatMessage({ id: 'biometrics.close' }),
            style: 'cancel',
          },
          {
            text: intl.formatMessage({ id: 'biometrics.openSettings' }),
            onPress: () => void Linking.openSettings(),
          },
        ],
      )
    } else if (result.error === 'not_enrolled') {
      Alert.alert(
        title,
        intl.formatMessage(
          { id: 'onboarding.biometrics.notEnrolled' },
          { biometricType: biometricType.text },
        ),
      )
    } else if (
      result.error !== 'user_cancel' &&
      result.error !== 'system_cancel' &&
      result.error !== 'app_cancel'
    ) {
      Alert.alert(
        title,
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
