import {setupGlobals} from './utils/lifecycle/setup-globals';
import {Navigation} from 'react-native-navigation';
import {getDefaultOptions} from './utils/get-default-options';
import {getAppRoot} from './utils/lifecycle/get-app-root';
import {registerAllComponents} from './utils/lifecycle/setup-components';
import {setupDevMenu} from './utils/lifecycle/setup-dev-menu';
import {setupEventHandlers} from './utils/lifecycle/setup-event-handlers';
import {
  setupNotifications,
  openInitialNotification,
} from './utils/lifecycle/setup-notifications';
import {setupRoutes} from './utils/lifecycle/setup-routes';
import {showAppLockOverlay} from './utils/app-lock';
import {readAuthorizeResult} from './stores/auth-store';
import {performanceMetricsAppLaunched} from './utils/performance-metrics';
import {ComponentRegistry, StackRegistry} from './utils/component-registry';

async function startApp() {
  // setup global packages and polyfills
  setupGlobals();
  console.log('setup globals');

  // Register all event handlers
  setupEventHandlers();
  console.log('setup event handlers');

  // setup development menu
  setupDevMenu();
  console.log('setup dev menu');

  // Setup app routing layer
  setupRoutes();
  console.log('setup routes');

  // Setup notifications
  setupNotifications();
  console.log('setup notifications');

  // Register all components (screens, UI elements)
  registerAllComponents();
  console.log('register all components');

  // Set default navigation theme options
  Navigation.setDefaultOptions(getDefaultOptions());

  // Wait until React Native is initialized
  Navigation.events().registerAppLaunchedListener(async () => {
    // Navigation.setRoot({
    //   root: {
    //     stack: {
    //       id: StackRegistry.LoginStack,
    //       children: [
    //         {
    //           component: {
    //             id: ComponentRegistry.LoginScreen,
    //             name: ComponentRegistry.LoginScreen,
    //           },
    //         },
    //       ],
    //     }
    //   }
    // })
    // return;

    console.log('app launched');
    // Read authorize result from keychain
    await readAuthorizeResult();
    console.log('auth result read');

    // Get app root
    const root = await getAppRoot();
    console.log('app root');

    // Dismiss all overlays
    await Navigation.dismissAllOverlays();
    console.log('dismiss all overlays');

    // Show lock screen overlay
    showAppLockOverlay({enforceActivated: true});

    // Dismiss all modals
    await Navigation.dismissAllModals();

    // Set the app root
    await Navigation.setRoot({root});

    // Open initial notification on android
    openInitialNotification();

    // Mark app launched
    performanceMetricsAppLaunched();
    console.log('all done');
  });
}

// Start the app
startApp();
