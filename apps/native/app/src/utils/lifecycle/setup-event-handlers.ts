import { AppState, AppStateStatus, Linking, Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { authStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { uiStore } from '../../stores/ui-store'
import { ButtonRegistry } from '../component-registry'
import { evaluateUrl, navigateTo } from '../deep-linking'
import { showLockScreenOverlay } from '../lock-screen-helpers'
import { isOnboarded } from '../onboarding'
import SpotlightSearch from 'react-native-spotlight-search'

let backgroundAppLockTimeout: number

export function setupEventHandlers() {
  // Listen for url events through iOS and Android's Linking library
  Linking.addEventListener('url', ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        evaluateUrl(url)
      }
    })
  })

  if (Platform.OS === 'ios') {
    SpotlightSearch.searchItemTapped((url) => {
      navigateTo(url);
    });

    SpotlightSearch.getInitialSearchItem().then(url => {
      navigateTo(url);
    });
  }

  // Get initial url and pass to the opener
  Linking.getInitialURL()
    .then((url) => {
      if (url) {
        Linking.openURL(url)
      }
    })
    .catch((err) => console.error('An error occurred in getInitialURL: ', err))

  Navigation.events().registerBottomTabSelectedListener((e) => {
    uiStore.setState({
      unselectedTab: e.unselectedTabIndex,
      selectedTab: e.selectedTabIndex,
    })
  })

  AppState.addEventListener('change', (status: AppStateStatus) => {
    const {
      lockScreenComponentId,
      lockScreenActivatedAt,
      noLockScreenUntilNextAppStateActive,
      userInfo,
    } = authStore.getState()
    const { dev__useLockScreen, appLockTimeout } = preferencesStore.getState()

    if (!userInfo || !isOnboarded() || dev__useLockScreen === false) {
      return
    }

    if (noLockScreenUntilNextAppStateActive) {
      authStore.setState({ noLockScreenUntilNextAppStateActive: false });
      return
    }

    if (status === 'background' || status === 'inactive') {
      if (Platform.OS === 'ios') {
        // Add a small delay for those accidental backgrounds in iOS
        backgroundAppLockTimeout = setTimeout(() => {
          if (!lockScreenComponentId) {
            showLockScreenOverlay({ status })
          } else {
            Navigation.updateProps(lockScreenComponentId, { status })
          }
        }, 100)
      } else {
        if (!lockScreenComponentId) {
          showLockScreenOverlay({ status })
        } else {
          Navigation.updateProps(lockScreenComponentId, { status })
        }
      }
    }

    if (status === 'active') {
      clearTimeout(backgroundAppLockTimeout)

      if (lockScreenComponentId) {
        if (
          lockScreenActivatedAt !== undefined &&
          lockScreenActivatedAt + appLockTimeout > Date.now()
        ) {
          Navigation.dismissAllOverlays()
          authStore.setState(() => ({
            lockScreenActivatedAt: undefined,
            lockScreenComponentId: undefined,
          }))
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
        navigateTo('/user')
      }
      if (buttonId === ButtonRegistry.NotificationsButton) {
        navigateTo('/notifications')
      }
    },
  )
}
