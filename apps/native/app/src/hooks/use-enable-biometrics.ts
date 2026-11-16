import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'

import { getIasClient, isTooManyElectronicIdRequests } from '@/lib/ias'
import { authStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'
import { useBiometricType } from './use-biometric-type'
import {
  closeElectronicIdSheet,
  isCancelled,
  useElectronicIdUnlock,
} from './use-electronic-id-unlock'

/**
 * Turns on biometric unlock for a native login. The person approves it with
 * electronic ID in its own request, and the tokens from that approval register
 * a new biometric key with IAS. A failure is shown in an alert.
 */
export function useEnableBiometrics() {
  const intl = useIntl()
  const { authenticationTypes } = useUiStore()
  const biometricType = useBiometricType(authenticationTypes)
  const [isEnabling, setIsEnabling] = useState(false)
  const electronicId = useElectronicIdUnlock('enableBiometrics')

  /** Resolves with whether biometrics are on. */
  const enableBiometrics = async (): Promise<boolean> => {
    if (electronicId.isPending()) {
      return false
    }
    setIsEnabling(true)
    try {
      const tokens = await electronicId.unlock()
      // As with an unlock, the earlier refresh token stops working.
      authStore.getState().unlockNative(tokens)
      await getIasClient().enableBiometrics(tokens.accessToken)
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
      // Still open after a success, or when registering the key failed.
      closeElectronicIdSheet()
      setIsEnabling(false)
    }
  }

  return { isEnabling, enableBiometrics }
}
