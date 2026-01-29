import './utils/intl-polyfill'
import { Navigation } from 'react-native-navigation'
import SpotlightSearch from 'react-native-spotlight-search'
import { initializeApolloClient } from './graphql/client'
import { prefetchAuthConfig, readAuthorizeResult } from './stores/auth-store'
import { showAppLockOverlay } from './utils/app-lock'
import { isIos } from './utils/devices'
import { getDefaultOptions } from './utils/get-default-options'
import { getAppRoot } from './utils/lifecycle/get-app-root'
import { handleInitialUrl } from './utils/lifecycle/handle-initial-url'
import { registerAllComponents } from './utils/lifecycle/setup-components'
import { setupDevMenu } from './utils/lifecycle/setup-dev-menu'
import { setupEventHandlers } from './utils/lifecycle/setup-event-handlers'
import { setupGlobals } from './utils/lifecycle/setup-globals'
import { setupRoutes } from './utils/lifecycle/setup-routes'
import { performanceMetricsAppLaunched } from './utils/performance-metrics'
import { setupQuickActions } from './utils/quick-actions'
import { navigateTo } from './lib/deep-linking'

async function startApp() {
  // setup global packages and polyfills
  setupGlobals()

  // Prefetch auth configuration on Android (non-blocking optimization)
  void prefetchAuthConfig()

  // Register all event handlers
  setupEventHandlers()

  // setup development menu
  setupDevMenu()

  // Setup app routing layer
  setupRoutes()

  // Initialize Apollo client. This must be done before registering components
  await initializeApolloClient()

  // Register all components (screens, UI elements)
  registerAllComponents()

  // Set default navigation theme options
  Navigation.setDefaultOptions(getDefaultOptions())

  // Wait until React Native is initialized
  Navigation.events().registerAppLaunchedListener(async () => {
    // Read authorize result from keychain
    await readAuthorizeResult()

    // Get app root
    const root = await getAppRoot()

    // Dismiss all overlays
    await Navigation.dismissAllOverlays()

    // Show lock screen overlay
    void showAppLockOverlay({ enforceActivated: true })

    // Dismiss all modals
    await Navigation.dismissAllModals()

    // Set the app root
    await Navigation.setRoot({ root })

    if (isIos) {
      // Quick actions setup, make sure to call this after setting the root
      setupQuickActions()

      // Spotlight search setup, make sure to call this after setting the root
      SpotlightSearch.searchItemTapped((url) => {
        navigateTo(url)
      })

      SpotlightSearch.getInitialSearchItem().then((url) => {
        navigateTo(url)
      })
    }

    handleInitialUrl()

    // Mark app launched
    performanceMetricsAppLaunched()
  })
}

startApp()
