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
 * Whether biometrics that may unlock the app are enrolled. On Android only
 * strong (class 3) biometrics count — weak ones such as camera-based face
 * unlock don't. iOS biometrics are all strong, and expo's iOS
 * getEnrolledLevelAsync never reports BIOMETRIC_STRONG, so iOS keeps
 * isEnrolledAsync.
 */
export async function isStrongBiometricsEnrolledAsync(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return isEnrolledAsync()
  }
  return (await getEnrolledLevelAsync()) === SecurityLevel.BIOMETRIC_STRONG
}

/**
 * Whether the device could offer biometrics that may unlock the app. On
 * Android a device with only weak biometrics (e.g. face unlock and no
 * fingerprint sensor) is treated as having no biometric hardware.
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
  // Fingerprint sensors are strong in practice; with nothing enrolled yet,
  // their presence is the best signal that strong biometrics are possible.
  const types = await supportedAuthenticationTypesAsync()
  return types.includes(AuthenticationType.FINGERPRINT)
}
