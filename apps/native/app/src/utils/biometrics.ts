import {
  AuthenticationType,
  getEnrolledLevelAsync,
  hasHardwareAsync,
  isEnrolledAsync,
  SecurityLevel,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { Platform } from 'react-native'

/**
 * Whether biometrics that can unlock the app are set up. The biometric key
 * needs strong (class 3) biometrics, so on Android weak ones such as camera
 * face unlock don't count. All of iOS's are strong, and its
 * getEnrolledLevelAsync never reports BIOMETRIC_STRONG.
 */
export async function isStrongBiometricsEnrolledAsync(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return isEnrolledAsync()
  }
  return (await getEnrolledLevelAsync()) === SecurityLevel.BIOMETRIC_STRONG
}

/**
 * Whether the phone can have biometrics that unlock the app. On Android one
 * with only weak biometrics, such as face unlock and no fingerprint sensor,
 * can't.
 */
export async function hasStrongBiometricHardwareAsync(): Promise<boolean> {
  if (!(await hasHardwareAsync())) {
    return false
  }
  if (Platform.OS !== 'android') {
    return true
  }
  if (await isStrongBiometricsEnrolledAsync()) {
    return true
  }
  // Fingerprint sensors are strong in practice: with nothing set up yet,
  // one is the best sign that strong biometrics are possible.
  const types = await supportedAuthenticationTypesAsync()
  return types.includes(AuthenticationType.FINGERPRINT)
}
