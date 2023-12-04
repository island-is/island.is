import { getPresentedNotificationsAsync } from 'expo-notifications'
import {
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  Linking,
  Platform,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import SpotlightSearch from 'react-native-spotlight-search'
import { evaluateUrl, navigateTo } from '../../lib/deep-linking'
import { authStore } from '../../stores/auth-store'
import { environmentStore } from '../../stores/environment-store'
import { preferencesStore } from '../../stores/preferences-store'
import { uiStore } from '../../stores/ui-store'
import {
  hideAppLockOverlay,
  showAppLockOverlay,
  skipAppLock,
} from '../app-lock'
import { ButtonRegistry } from '../component-registry'
import { handleQuickAction } from '../quick-actions'
import { handleNotificationResponse } from './setup-notifications'

let backgroundAppLockTimeout: NodeJS.Timeout

export function setupEventHandlers() {
  // Listen for url events through iOS and Android's Linking library
  Linking.addEventListener('url', ({ url }) => {
    console.log('URL', url)
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        evaluateUrl(url)
      }
    })

    // Handle Cognito
    if (/cognito/.test(url)) {
      const [, hash] = url.split('#')
      const params = String(hash)
        .split('&')
        .reduce((acc, param) => {
          const [key, value] = param.split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
      environmentStore.getState().actions.setCognito({
        idToken: params.id_token,
        accessToken: params.access_token,
        expiresIn: Number(params.expires_in),
        expiresAt: Number(params.expires_in) + Date.now() / 1000,
        tokenType: params.token_type,
      })
      Navigation.dismissAllModals()
    }
  })

  if (Platform.OS === 'ios') {
    SpotlightSearch.searchItemTapped((url) => {
      navigateTo(url)
    })

    SpotlightSearch.getInitialSearchItem().then((url) => {
      navigateTo(url)
    })
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
    } = authStore.getState()
    const { appLockTimeout } = preferencesStore.getState()

    if (status === 'active') {
      getPresentedNotificationsAsync().then((notifications) => {
        notifications.forEach((notification) =>
          handleNotificationResponse({
            notification,
            actionIdentifier: 'NOOP',
          }),
        )
      })
    }

    if (!skipAppLock()) {
      if (noLockScreenUntilNextAppStateActive) {
        authStore.setState({ noLockScreenUntilNextAppStateActive: false })
        return
      }

      if (status === 'background' || status === 'inactive') {
        if (Platform.OS === 'ios') {
          // Add a small delay for those accidental backgrounds in iOS
          backgroundAppLockTimeout = setTimeout(() => {
            if (!lockScreenComponentId) {
              showAppLockOverlay({ status })
            } else {
              Navigation.updateProps(lockScreenComponentId, { status })
            }
          }, 100)
        } else {
          if (!lockScreenComponentId) {
            showAppLockOverlay({ status })
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
            hideAppLockOverlay()
          } else {
            Navigation.updateProps(lockScreenComponentId, { status })
          }
        }
      }
    }
  })

  // handle navigation topBar buttons
  Navigation.events().registerNavigationButtonPressedListener(
    ({ buttonId }) => {
      switch (buttonId) {
        case ButtonRegistry.SettingsButton:
          return navigateTo('/settings')
        case ButtonRegistry.NotificationsButton:
          return navigateTo('/notifications')
        case ButtonRegistry.ScanLicenseButton:
          return navigateTo('/license-scanner')
      }
    },
  )

  // Handle quick actions
  DeviceEventEmitter.addListener('quickActionShortcut', handleQuickAction)
}
