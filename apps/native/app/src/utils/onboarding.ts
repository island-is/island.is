import { hasHardwareAsync } from 'expo-local-authentication'
import { Platform } from 'react-native'
import { router } from 'expo-router'
import { isIos } from './devices'
import { androidIsVersion33OrAbove } from './versions-check'
import { preferencesStore } from '../stores/preferences-store'

export function isOnboarded() {
  const {
    hasOnboardedNotifications,
    hasOnboardedBiometrics,
    hasOnboardedPrivacy,
  } = preferencesStore.getState()

  return (
    hasOnboardedBiometrics &&
    (Platform.OS === 'android' || hasOnboardedNotifications) &&
    hasOnboardedPrivacy
  )
}

/**
 * Returns the next onboarding step that needs to be completed,
 * or null if onboarding is done.
 */
export async function getNextOnboardingStep(): Promise<
  'biometrics' | 'notifications' | 'privacy' | null
> {
  const {
    hasOnboardedNotifications,
    hasOnboardedBiometrics,
    hasOnboardedPrivacy,
  } = preferencesStore.getState()

  const hasHardware = await hasHardwareAsync()
  if (hasHardware) {
    if (!hasOnboardedBiometrics) {
      return 'biometrics'
    }
  } else {
    // No biometric hardware — skip that step
    preferencesStore.setState({ hasOnboardedBiometrics: true })
  }

  if (isIos || androidIsVersion33OrAbove()) {
    if (!hasOnboardedNotifications) {
      return 'notifications'
    }
  }

  if (!hasOnboardedPrivacy) {
    return 'privacy'
  }

  return null
}

/**
 * Advance to the next onboarding step or navigate to the main app.
 * Called after login and after each onboarding screen completes.
 */
export async function nextOnboardingStep() {
  const step = await getNextOnboardingStep()
  if (step === null) {
    // All onboarding complete — go to main tabs
    router.replace('/(auth)/(tabs)')
    return
  }

  if (step === 'biometrics') {
    router.replace('/(auth)/onboarding/biometrics')
  } else if (step === 'notifications') {
    router.replace('/(auth)/onboarding/notifications')
  } else if (step === 'privacy') {
    router.replace('/(auth)/onboarding/privacy')
  }
}
