import { Navigation } from 'react-native-navigation'
import { registerAllComponents } from './screens'
import { setupEventHandlers } from './utils/lifecycle/setup-event-handlers'
import { setupRoutes } from './utils/lifecycle/setup-routes'
import { setupNotifications } from './utils/lifecycle/setup-notifications'
import { getAppRoot }from './utils/lifecycle/get-app-root';
import { getDefaultOptions } from './utils/get-default-options'
import { setupDevMenu } from './utils/lifecycle/setup-dev-menu'
import { setupGlobals } from './utils/lifecycle/setup-globals'

function startApp() {
  setupGlobals();

  // Register all components (screens, UI elements)
  registerAllComponents();

  // Register all event handlers
  setupEventHandlers();

  // setup development menu
  setupDevMenu();

  // Setup app routing layer
  setupRoutes();

  // Setup notifications
  setupNotifications();

  // Set default navigation theme options
  Navigation.setDefaultOptions(getDefaultOptions());

  // Wait until React Native is initialized
  Navigation.events().registerAppLaunchedListener(async () => {

    // Dismiss all previous modals (good when in development mode)
    Navigation.dismissAllModals();

    // Set the app root
    Navigation.setRoot({
      root: await getAppRoot()
    });
  });
}

// Start the app
startApp();
