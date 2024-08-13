import { Platform } from 'react-native'
import { coerceToNumber } from './coerce-to-number'
import { isAndroid } from './devices'

/**
 * Check if the Android version is greater than or equal to 33.
 * Since Android 13 (API level 33), apps must explicitly request permission for posting notifications using POST_NOTIFICATIONS.
 * Note: However, if your app does not explicitly declare or handle this new permission, it might not be granted even if FCM (Firebase Cloud Messaging) says it's ready.
 */
export const androidIsVersion33OrAbove = () =>
  isAndroid && coerceToNumber(Platform.Version) >= 33
