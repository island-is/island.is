import { Keyboard } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { authStore } from '../stores/auth-store'
import { preferencesStore } from '../stores/preferences-store'
import { ComponentRegistry } from './component-registry'
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
  status = 'active',
}: {
  enforceActivated?: boolean
  status?: string
}) {
  if (skipAppLock()) {
    return Promise.resolve()
  }

  // dismiss keyboard
  Keyboard.dismiss()

  // set now
  let lockScreenActivatedAt = Date.now()
  if (enforceActivated) {
    // set yesterday
    lockScreenActivatedAt -= 86400 * 1000
  }
  authStore.setState({
    lockScreenActivatedAt,
  })

  return Navigation.showOverlay({
    component: {
      name: ComponentRegistry.AppLockScreen,
      passProps: { status, lockScreenActivatedAt },
    },
  })
}

export function hideAppLockOverlay(lockScreenComponentId: string) {
  // Dismiss the lock screen
  void Navigation.dismissOverlay(lockScreenComponentId)

  // reset lockscreen parameters
  authStore.setState({
    lockScreenActivatedAt: undefined,
    lockScreenComponentId: undefined,
  })
}
