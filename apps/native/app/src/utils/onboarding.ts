import { supportedAuthenticationTypesAsync } from 'expo-local-authentication'
import { router } from 'expo-router'
import { isIos } from './devices'
import { androidIsVersion33OrAbove } from './versions-check'
import { preferencesStore } from '../stores/preferences-store'
import { uiStore } from '../stores/ui-store'
import { hasStrongBiometricHardwareAsync } from './biometrics'

type OnboardingStep = 'biometrics' | 'notifications' | 'privacy'

/**
 * The first step not done yet, or null when onboarding is done.
 * `hasBiometrics`: biometrics that can unlock the app, also when they're
 * turned off for it. iOS then says there's no hardware, and the step says
 * where to turn them on, so only a phone without any skips it.
 */
function getFirstStepLeft(hasBiometrics: boolean): OnboardingStep | null {
  const {
    hasOnboardedBiometrics,
    hasOnboardedNotifications,
    hasOnboardedPrivacy,
  } = preferencesStore.getState()
  if (hasBiometrics && !hasOnboardedBiometrics) {
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
 * The onboarding step to come back to after an unlock, for someone who left
 * part way through. That includes biometrics: turning them on for the app in
 * the phone's settings restarts the app.
 */
export function getUnfinishedOnboardingStep(): OnboardingStep | null {
  const { authenticationTypes, hasStrongBiometricHardware } = uiStore.getState()
  return getFirstStepLeft(
    hasStrongBiometricHardware || (isIos && authenticationTypes.length > 0),
  )
}

/**
 * Returns the next onboarding step that needs to be completed,
 * or null if onboarding is done.
 */
export async function getNextOnboardingStep(): Promise<OnboardingStep | null> {
  const hasBiometrics =
    (await hasStrongBiometricHardwareAsync()) ||
    (isIos && (await supportedAuthenticationTypesAsync()).length > 0)
  if (!hasBiometrics) {
    preferencesStore.setState({ hasOnboardedBiometrics: true })
  }
  return getFirstStepLeft(hasBiometrics)
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
