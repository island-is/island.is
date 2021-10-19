import * as Sentry from '@sentry/react-native'
import { Base64 } from 'js-base64'
import { Navigation, Options, OptionsModalPresentationStyle } from 'react-native-navigation'
import { addRoute, addScheme } from '../../lib/deep-linking'
import { ApplicationsScreen } from '../../screens/applications/applications'
import { DocumentDetailScreen } from '../../screens/document-detail/document-detail'
import { authStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { uiStore } from '../../stores/ui-store'
import { ComponentRegistry, StackRegistry, MainBottomTabs } from '../component-registry'
import { config } from '../config'

const selectTab = (currentTabIndex: number) => {
  // Selected Tab navigation event wont fire for this. Need to manually set in ui store.
  const { selectedTab } = uiStore.getState()
  uiStore.setState({ unselectedTab: selectedTab, selectedTab: currentTabIndex })
  // switch tab
  Navigation.mergeOptions(MainBottomTabs, {
    bottomTabs: {
      currentTabIndex,
    },
  })
}

export function setupRoutes() {
  // Setup app scheme (is.island.app://)
  addScheme(`${config.bundleId}://`)

  // Routes
  addRoute('/', () => {
    Navigation.dismissAllModals()
    selectTab(1)
  })

  addRoute('/inbox', () => {
    Navigation.dismissAllModals()
    selectTab(0)
  })

  addRoute('/wallet', () => {
    Navigation.dismissAllModals()
    selectTab(2)
  })


  addRoute('/applications', async (passProps: any) => {
    selectTab(1)

    await Navigation.dismissAllModals()
    await Navigation.popToRoot(StackRegistry.HomeStack)
    await Navigation.push(ComponentRegistry.HomeScreen, {
      component: {
        name: ComponentRegistry.ApplicationsScreen,
        passProps,
        options: ApplicationsScreen.options as Options,
      },
    })
  })

  addRoute('/notification/:id', (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.NotificationDetailScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/wallet/:passId', async ({ passId, fromId, toId, item, ...rest }: any) => {
    selectTab(2)
    await Navigation.popToRoot(StackRegistry.WalletStack)
    Navigation.push(StackRegistry.WalletStack, {
      component: {
        name: ComponentRegistry.WalletPassScreen,
        passProps: {
          id: passId,
          item,
          ...rest
        },
        options: {
          animations: {
            push: {
              sharedElementTransitions: [
                {
                  fromId,
                  toId,
                  interpolation: { type: 'spring' },
                },
              ],
            },
          },
        },
      },
    })
  })

  addRoute('/license-scanner', async () => {
    Navigation.showModal({
      stack: {
        id: StackRegistry.LicenseScannerStack,
        options: {
          modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
        },
        children: [{
          component: {
            name: ComponentRegistry.LicenseScannerScreen,
          }
        }],
      }
    });
  });

  addRoute('/inbox/:docId', async ({ docId, title }: any) => {
    selectTab(0)

    // ensure INBOX_SCREEN doesn't already have same screen with same componentId etc.
    await Navigation.dismissAllModals()
    await Navigation.popToRoot(StackRegistry.InboxStack)
    await Navigation.push(StackRegistry.InboxStack, {
      component: {
        name: ComponentRegistry.DocumentDetailScreen,
        passProps: {
          docId,
        },
        options: DocumentDetailScreen.options as Options,
      },
    })
  })

  addRoute('/user', () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.UserScreen,
            },
          },
        ],
      },
    })
  })

  addRoute('/notifications', () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.NotificationsScreen,
            },
          },
        ],
      },
    })
  })

  addRoute('/webview', (passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.WebViewScreen,
              passProps,
            },
          },
        ],
      },
    })
  })

  addRoute('/e2e/cookie/:cookie', ({ cookie }: any) => {
    const decodedCookie = Base64.decode(cookie)
    authStore.setState({ cookies: decodedCookie })
    Sentry.init({ enabled: false })
  })

  addRoute('/e2e/disable-applock', () => {
    preferencesStore.setState({ dev__useLockScreen: false })
    Sentry.init({ enabled: false })
  })
}
