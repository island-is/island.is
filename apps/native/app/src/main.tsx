import { Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { getDefaultOptions } from './utils/get-default-options'
import { getAppRoot } from './utils/lifecycle/get-app-root'
import { registerAllComponents } from './utils/lifecycle/setup-components'
import { setupDevMenu } from './utils/lifecycle/setup-dev-menu'
import { setupEventHandlers } from './utils/lifecycle/setup-event-handlers'
import { setupGlobals } from './utils/lifecycle/setup-globals'
import { setupNotifications } from './utils/lifecycle/setup-notifications'
import { setupRoutes } from './utils/lifecycle/setup-routes'
import { showLockScreenOverlay } from './utils/lock-screen-helpers'

async function startApp() {
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

  // Wait until React Native is initialized
  Navigation.events().registerAppLaunchedListener(async () => {
    // Set default navigation theme options
    Navigation.setDefaultOptions(getDefaultOptions())

    // Dismiss all previous modals (good when in development mode)
    await Navigation.dismissAllModals()
    await Navigation.dismissAllOverlays()

    // Show lock screen overlay
    // if (Platform.OS === 'ios') {
    //   await showLockScreenOverlay({ enforceActivated: true })
    // }

    // Set the app root
    Navigation.setRoot({
      root: await getAppRoot(),
    })

    // Show lock screen overlay (android needs after setRoot)
    // if (Platform.OS === 'android') {
    showLockScreenOverlay({ enforceActivated: true })
    // }
  })
}

// Start the app
startApp()
