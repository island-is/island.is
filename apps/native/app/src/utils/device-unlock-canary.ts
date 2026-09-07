import { Platform } from 'react-native'
import Keychain from 'react-native-keychain'

/**
 * Tells the lock screen whether the device is genuinely unlocked. With
 * Always-On Display, iOS reports the app as 'active' while the phone is
 * locked, so AppState can't be trusted. A keychain item with WHEN_UNLOCKED
 * accessibility can: reading it while the device is locked always fails
 * (errSecInteractionNotAllowed, -25308).
 */

const SERVICE = 'DEVICE_UNLOCK_CANARY'

// Writes the canary item. Idempotent; call when the device is certainly
// unlocked (cold start, successful auth). Failures are ignored — without a
// canary the probe fails open.
export async function ensureDeviceUnlockCanary(): Promise<void> {
  if (Platform.OS !== 'ios') {
    return
  }
  try {
    await Keychain.setGenericPassword('canary', 'unlocked', {
      service: SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    })
  } catch {
    // Best effort.
  }
}

// Returns false only when the keychain proves the device is locked. A
// missing canary or unexpected error returns true (fail open).
export async function isDeviceUnlocked(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return true
  }
  try {
    await Keychain.getGenericPassword({ service: SERVICE })
    return true
  } catch (error) {
    const message = `${(error as Error)?.message ?? ''} ${
      (error as { code?: string })?.code ?? ''
    }`
    if (/-25308|interaction/i.test(message)) {
      return false
    }
    return true
  }
}
