import { Navigation } from 'react-native-navigation'
import { readAuthorizeResult } from './stores/auth-store'
import { showAppLockOverlay } from './utils/app-lock'
import { getDefaultOptions } from './utils/get-default-options'
import { getAppRoot } from './utils/lifecycle/get-app-root'
import { registerAllComponents } from './utils/lifecycle/setup-components'
import { setupDevMenu } from './utils/lifecycle/setup-dev-menu'
import { setupEventHandlers } from './utils/lifecycle/setup-event-handlers'
import { setupGlobals } from './utils/lifecycle/setup-globals'
import {
  openInitialNotification,
  setupNotifications,
} from './utils/lifecycle/setup-notifications'
import { setupRoutes } from './utils/lifecycle/setup-routes'
import { performanceMetricsAppLaunched } from './utils/performance-metrics'

async function startApp() {
  // setup global packages and polyfills
  setupGlobals()

  // Register all event handlers
  setupEventHandlers()

  // setup development menu
  setupDevMenu()

  // Setup app routing layer
  setupRoutes()

  // Setup notifications
  setupNotifications()

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
    showAppLockOverlay({ enforceActivated: true })

    // Dismiss all modals
    await Navigation.dismissAllModals()

    // Set the app root
    await Navigation.setRoot({ root })

    // Open initial notification on android
    openInitialNotification()

    // Mark app launched
    performanceMetricsAppLaunched()
  })
}

// Start the app
startApp()
