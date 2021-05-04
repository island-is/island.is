import { AppState, AppStateStatus } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Linking } from 'react-native'
import { authStore } from '../../stores/auth-store'
import { config } from '../config'
import { evaluateUrl, navigateTo } from '../deep-linking'
import { ButtonRegistry, ComponentRegistry } from '../navigation-registry'
import { isOnboarded } from '../onboarding'

const LOCK_SCREEN_TIMEOUT = 5000

export function setupEventHandlers() {
  // Listen for url events through iOS and Android's Linking library
  Linking.addEventListener('url', ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        evaluateUrl(url)
      }
    })
  })

  // Get initial url and pass to the opener
  Linking.getInitialURL()
    .then((url) => {
      if (url) {
        Linking.openURL(url)
      }
    })
    .catch((err) => console.error('An error occurred in getInitialURL: ', err))

  AppState.addEventListener('change', (status: AppStateStatus) => {
    const {
      lockScreenComponentId,
      lockScreenActivatedAt,
      userInfo,
    } = authStore.getState()

    if (!userInfo || !isOnboarded()) {
      return
    }

    // Lockscreen related
    if (!config.disableLockScreen) {
      if (status === 'active') {
        if (lockScreenComponentId) {
          if (
            lockScreenActivatedAt !== undefined &&
            lockScreenActivatedAt + LOCK_SCREEN_TIMEOUT > Date.now()
          ) {
            Navigation.dismissAllOverlays();
            authStore.setState(() => ({
              lockScreenActivatedAt: undefined,
              lockScreenComponentId: undefined,
            }));
          } else {
            Navigation.updateProps(lockScreenComponentId, { status })
          }
        }
      }

      if (status === 'background' || status === 'inactive') {
        if (!lockScreenComponentId) {
          Navigation.showOverlay({
            component: {
              name: ComponentRegistry.AppLockScreen,
              passProps: { isRoot: false, status },
            },
          })
        } else {
          Navigation.updateProps(lockScreenComponentId, { status })
        }
      }
    }
  })

  // show user screen
  Navigation.events().registerNavigationButtonPressedListener(
    ({ buttonId }) => {
      if (buttonId === ButtonRegistry.UserButton) {
        navigateTo('/settings')
      }
      if (buttonId === ButtonRegistry.NotificationsButton) {
        navigateTo('/notifications');
      }
    },
  )
}
