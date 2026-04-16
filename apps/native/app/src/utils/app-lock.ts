import { Keyboard } from 'react-native'
import { router } from 'expo-router'
import { authStore } from '../stores/auth-store'
import { preferencesStore } from '../stores/preferences-store'
import { isOnboarded } from './onboarding'

export function skipAppLock() {
  const { authorizeResult } = authStore.getState()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { dev__useLockScreen } = preferencesStore.getState()

  const isNotOnboarded = !isOnboarded()
  const isNotAuthorized = !authorizeResult
  const isDisabledByDev = dev__useLockScreen === false
  const skip = isNotOnboarded || isNotAuthorized || isDisabledByDev

  return skip
}

export function showAppLockOverlay({
  enforceActivated = false,
}: {
  enforceActivated?: boolean
} = {}) {
  if (skipAppLock()) {
    return
  }

  Keyboard.dismiss()

  let lockScreenActivatedAt = Date.now()
  if (enforceActivated) {
    lockScreenActivatedAt -= 86400 * 1000
  }
  authStore.setState({ lockScreenActivatedAt })
  router.push('/app-lock')
}

export function hideAppLockOverlay() {
  authStore.setState({
    lockScreenActivatedAt: undefined,
    lockScreenComponentId: undefined,
  })
  router.back()
}
