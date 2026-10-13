import { Alert, Platform } from 'react-native'
import {
  checkBiometricEnrollment,
  enrollBiometricBaseline,
} from '../../modules/biometric-integrity'
import { getIntl } from '../components/providers/locale-provider'
import { preferencesStore } from '../stores/preferences-store'
import { isStrongBiometricsEnrolledAsync } from './biometrics'
import { deduplicatePromise } from './deduplicatePromise'

function turnOffBiometrics(messagePrefix: string) {
  preferencesStore.getState().setUseBiometrics(false)

  const intl = getIntl()
  Alert.alert(
    intl.formatMessage({ id: `${messagePrefix}.title` }),
    intl.formatMessage({ id: `${messagePrefix}.message` }),
  )
}

/**
 * Turns biometric unlock off when the device's enrolled biometrics changed
 * since the user opted in, so a newly added face or finger can't unlock the
 * app. On Android it is also turned off when no strong biometrics are
 * enrolled (users who opted in with weak ones). The user unlocks with PIN and
 * can re-enable biometrics in settings.
 *
 * Resolves true when biometric unlock is enabled and may be used. Concurrent
 * calls share one check so the user sees at most one alert.
 */
export const verifyBiometricIntegrity = deduplicatePromise(
  async (): Promise<boolean> => {
    if (!preferencesStore.getState().useBiometrics) {
      return false
    }

    const status = checkBiometricEnrollment()
    if (status === 'changed') {
      turnOffBiometrics('biometrics.enrollmentChanged')
      return false
    }

    if (
      Platform.OS === 'android' &&
      !(await isStrongBiometricsEnrolledAsync())
    ) {
      turnOffBiometrics('biometrics.strongRequired')
      return false
    }

    // Opted in before this check existed — take the current state as baseline.
    // Without one, later changes can't be detected, so fall back to PIN.
    if (status === 'missing' && !enrollBiometricBaseline()) {
      preferencesStore.getState().setUseBiometrics(false)
      return false
    }
    return true
  },
)
