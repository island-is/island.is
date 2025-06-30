import { addEventListener } from '@react-native-community/netinfo'
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics'
import {
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  Linking,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import SpotlightSearch from 'react-native-spotlight-search'
import { evaluateUrl, navigateTo } from '../../lib/deep-linking'
import { authStore } from '../../stores/auth-store'
import { environmentStore } from '../../stores/environment-store'
import { offlineStore } from '../../stores/offline-store'
import { preferencesStore } from '../../stores/preferences-store'
import { uiStore } from '../../stores/ui-store'
import {
  hideAppLockOverlay,
  showAppLockOverlay,
  skipAppLock,
} from '../app-lock'
import { ButtonRegistry, ComponentRegistry as CR } from '../component-registry'
import { isIos } from '../devices'
import { handleQuickAction } from '../quick-actions'

let backgroundAppLockTimeout: ReturnType<typeof setTimeout>

export function setupEventHandlers() {
  // Listen for url events through iOS and Android's Linking library
  Linking.addEventListener('url', ({ url }) => {
    if (url.includes('wallet/')) {
      return evaluateUrl(url)
    }

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

  if (isIos) {
    SpotlightSearch.searchItemTapped((url) => {
      navigateTo(url)
    })

    SpotlightSearch.getInitialSearchItem().then((url) => {
      navigateTo(url)
    })
  }

  Navigation.events().registerBottomTabSelectedListener((e) => {
    uiStore.setState({
      unselectedTab: e.unselectedTabIndex,
      selectedTab: e.selectedTabIndex,
    })
  })

  AppState.addEventListener('change', (status: AppStateStatus) => {
    const { noLockScreenUntilNextAppStateActive } = authStore.getState()
    const { appLockTimeout } = preferencesStore.getState()

    if (!skipAppLock()) {
      if (noLockScreenUntilNextAppStateActive) {
        authStore.setState({ noLockScreenUntilNextAppStateActive: false })
        return
      }
      clearTimeout(backgroundAppLockTimeout)

      if (status === 'background' || status === 'inactive') {
        // Add a small delay for those accidental backgrounds in iOS
        if (isIos) {
          backgroundAppLockTimeout = setTimeout(() => {
            const { lockScreenComponentId, lockScreenActivatedAt } =
              authStore.getState()

            if (!lockScreenComponentId && !lockScreenActivatedAt) {
              showAppLockOverlay({ status })
            } else if (lockScreenComponentId) {
              Navigation.updateProps(lockScreenComponentId, { status })
            }
          }, 100)
        } else {
          // set timeout does not work properly on android when app is in background
          const { lockScreenComponentId, lockScreenActivatedAt } =
            authStore.getState()

          if (!lockScreenComponentId && !lockScreenActivatedAt) {
            showAppLockOverlay({ status })
          } else if (lockScreenComponentId) {
            Navigation.updateProps(lockScreenComponentId, { status })
          }
        }
      }

      if (status === 'active') {
        const { lockScreenComponentId, lockScreenActivatedAt } =
          authStore.getState()
        if (lockScreenComponentId) {
          if (
            lockScreenActivatedAt !== undefined &&
            lockScreenActivatedAt + appLockTimeout > Date.now()
          ) {
            hideAppLockOverlay(lockScreenComponentId)
          } else {
            Navigation.updateProps(lockScreenComponentId, { status })
          }
        }
      }
    }
  })

  const handleOfflineButtonClick = () => {
    const offlineState = offlineStore.getState()

    if (!offlineState.bannerVisible) {
      void impactAsync(ImpactFeedbackStyle.Heavy)
      void Navigation.showOverlay({
        component: {
          id: CR.OfflineBanner,
          name: CR.OfflineBanner,
        },
      })
    } else {
      void Navigation.dismissOverlay(CR.OfflineBanner)
    }
  }

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
        case ButtonRegistry.OfflineButton:
          return handleOfflineButtonClick()
        case ButtonRegistry.HomeScreenOptionsButton:
          return navigateTo('/home-options')
      }
    },
  )

  // Handle quick actions
  DeviceEventEmitter.addListener('quickActionShortcut', handleQuickAction)

  // Subscribe to network status changes
  addEventListener(({ isConnected }) => {
    const offlineStoreState = offlineStore.getState()

    if (!isConnected) {
      offlineStoreState.actions.setNetInfoNoConnection()
    } else {
      offlineStoreState.actions.setIsConnected(true)

      if (!offlineStoreState.pastIsConnected) {
        offlineStoreState.actions.resetConnectionState()
      }
    }
  })
}
