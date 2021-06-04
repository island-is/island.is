import * as Sentry from '@sentry/react-native'
import { Base64 } from 'js-base64'
import { Navigation, Options } from 'react-native-navigation'
import { addRoute, addScheme } from '../../lib/deep-linking'
import { DocumentDetailScreen } from '../../screens/document-detail/document-detail'
import { authStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { uiStore } from '../../stores/ui-store'
import { ComponentRegistry } from '../component-registry'
import { config } from '../config'

const selectTab = (currentTabIndex: number) => {
  // Selected Tab navigation event wont fire for this. Need to manually set in ui store.
  const { selectedTab } = uiStore.getState()
  uiStore.setState({ unselectedTab: selectedTab, selectedTab: currentTabIndex })
  // switch tab
  Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
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

  addRoute('/wallet/:passId', async ({ passId, fromId, toId, item }: any) => {
    selectTab(2)
    await Navigation.popToRoot('WALLET_TAB')
    Navigation.push('WALLET_TAB', {
      component: {
        name: ComponentRegistry.WalletPassScreen,
        passProps: {
          id: passId,
          item,
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

  addRoute('/inbox/:docId', async ({ docId, title }: any) => {
    selectTab(0)

    // ensure INBOX_SCREEN doesn't already have same screen with same componentId etc.
    await Navigation.dismissAllModals()
    await Navigation.popToRoot('INBOX_SCREEN')
    await Navigation.push('INBOX_TAB', {
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
