import {
  hasHardwareAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { router } from 'expo-router'
import { isIos } from './devices'
import { androidIsVersion33OrAbove } from './versions-check'
import { preferencesStore } from '../stores/preferences-store'
import { uiStore } from '../stores/ui-store'

/**
 * The onboarding step to come back to after an unlock, for someone who left
 * part way through. That includes biometrics: turning them on for the app in
 * the phone's settings restarts the app.
 */
export function getUnfinishedOnboardingStep():
  | 'biometrics'
  | 'notifications'
  | 'privacy'
  | null {
  const {
    hasOnboardedBiometrics,
    hasOnboardedNotifications,
    hasOnboardedPrivacy,
  } = preferencesStore.getState()
  // Any biometrics, also when they're turned off for the app.
  if (
    uiStore.getState().authenticationTypes.length > 0 &&
    !hasOnboardedBiometrics
  ) {
    return 'biometrics'
  }
  if ((isIos || androidIsVersion33OrAbove()) && !hasOnboardedNotifications) {
    return 'notifications'
  }
  if (!hasOnboardedPrivacy) {
    return 'privacy'
  }
  return null
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

  // iOS says there's no hardware also when biometrics are turned off for this
  // app. The step then says where to turn them on, so only a phone without
  // any skips it.
  const hasBiometrics =
    (await hasHardwareAsync()) ||
    (isIos && (await supportedAuthenticationTypesAsync()).length > 0)
  if (hasBiometrics) {
    if (!hasOnboardedBiometrics) {
      return 'biometrics'
    }
  } else {
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
