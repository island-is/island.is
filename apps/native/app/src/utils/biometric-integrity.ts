import { Alert } from 'react-native'
import {
  checkBiometricEnrollment,
  enrollBiometricBaseline,
} from '../../modules/biometric-integrity'
import { getIntl } from '../components/providers/locale-provider'
import { preferencesStore } from '../stores/preferences-store'

/**
 * Turns biometric unlock off when the device's enrolled biometrics changed
 * since the user opted in, so a newly added face or finger can't unlock the
 * app. The user unlocks with PIN and can re-enable biometrics in settings.
 *
 * Returns true when biometric unlock is enabled and may be used.
 */
export function verifyBiometricIntegrity(): boolean {
  const { useBiometrics, setUseBiometrics } = preferencesStore.getState()
  if (!useBiometrics) {
    return false
  }

  const status = checkBiometricEnrollment()
  if (status === 'missing') {
    // Opted in before this check existed — take the current state as baseline.
    enrollBiometricBaseline()
    return true
  }
  if (status !== 'changed') {
    return true
  }

  setUseBiometrics(false)

  const intl = getIntl()
  Alert.alert(
    intl.formatMessage({ id: 'biometrics.enrollmentChanged.title' }),
    intl.formatMessage({ id: 'biometrics.enrollmentChanged.message' }),
  )
  return false
}
