// import 'react-native/Libraries/Core/InitializeCore'
import './utils/intl-polyfill'

import { initializeApolloClient } from './graphql/client'
import { registerAllComponents } from './utils/lifecycle/setup-components'
import SpotlightSearch from 'react-native-spotlight-search'
import { setupDevMenu } from './utils/lifecycle/setup-dev-menu'
import { setupGlobals } from './utils/lifecycle/setup-globals'
import { setupRoutes } from './utils/lifecycle/setup-routes'
import { getDefaultOptions } from './utils/get-default-options'
import { Navigation } from 'react-native-navigation'
import { readAuthorizeResult } from './stores/auth-store'
import { getAppRoot } from './utils/lifecycle/get-app-root'
import { showAppLockOverlay } from './utils/app-lock'
import { isIos } from './utils/devices'
import { navigateTo } from './lib/deep-linking'
import { setupQuickActions } from './utils/quick-actions'
import { handleInitialUrl } from './utils/lifecycle/handle-initial-url'
import { performanceMetricsAppLaunched } from './utils/performance-metrics'
import { setupEventHandlers } from './utils/lifecycle/setup-event-handlers'

async function startApp() {
  // setup global packages and polyfills
  setupGlobals()

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
    // // Get app root
    const root = await getAppRoot()
    // // Dismiss all overlays
    await Navigation.dismissAllOverlays()
    // // Show lock screen overlay
    void showAppLockOverlay({ enforceActivated: true })
    // // Dismiss all modals
    await Navigation.dismissAllModals()
    console.log('root', root)
    // // Set the app root
    await Navigation.setRoot({ root })
    if (isIos) {
      //   // Quick actions setup, make sure to call this after setting the root
      setupQuickActions()
      //   // Spotlight search setup, make sure to call this after setting the root
      SpotlightSearch.searchItemTapped((url) => {
        navigateTo(url)
      })
      SpotlightSearch.getInitialSearchItem().then((url) => {
        navigateTo(url)
      })
    }
    handleInitialUrl()
    // // Mark app launched
    performanceMetricsAppLaunched()
  })
}

startApp()
