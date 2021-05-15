import { Navigation } from 'react-native-navigation'
import { authStore } from '../stores/auth-store'
import { preferencesStore } from '../stores/preferences-store'
import { ComponentRegistry } from './component-registry'
import { isOnboarded } from './onboarding'

export function showLockScreenOverlay({
  enforceActivated = false,
  status = 'active',
}: {
  enforceActivated?: boolean
  status?: string
}) {
  const { userInfo } = authStore.getState()
  const { dev__useLockScreen } = preferencesStore.getState()

  if (!userInfo || !isOnboarded() || dev__useLockScreen === false) {
    return Promise.resolve()
  }

  // set now
  let lockScreenActivatedAt = Date.now()
  if (enforceActivated) {
    // set yesterday
    lockScreenActivatedAt -= 86400 * 1000
    authStore.setState({
      lockScreenActivatedAt,
    })
  }

  return Navigation.showOverlay({
    component: {
      name: ComponentRegistry.AppLockScreen,
      passProps: { status, lockScreenActivatedAt },
    },
  })
}

export function hideLockScreenOverlay() {
  // reset lockscreen parameters
  authStore.setState({
    lockScreenActivatedAt: undefined,
    lockScreenComponentId: undefined,
  })

  // Dismiss all overlays
  Navigation.dismissAllOverlays()
}
