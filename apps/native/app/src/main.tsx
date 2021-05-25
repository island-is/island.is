import AsyncStorage from '@react-native-community/async-storage'
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

  // would be good to wait for async to complete
  try {
    // await AsyncStorage.getItem('test');
  } catch (e) {
    // noop
  }

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

    // skipAppLock();

    // Dismiss all previous modals (good when in development mode)
    await Navigation.dismissAllModals()
    await Navigation.dismissAllOverlays()

    // Set the app root
    await Navigation.setRoot({
      root: await getAppRoot(),
    })

    // Show lock screen overlay (android needs after setRoot)
    await showLockScreenOverlay({ enforceActivated: true })
  })
}

// Start the app
startApp()
