import { Navigation } from 'react-native-navigation'
import { ComponentRegistry } from '../component-registry'
import { config } from '../config'
import { addRoute, addScheme } from '../deep-linking'

export function setupRoutes() {
  // Setup app scheme (is.island.app://)
  addScheme(`${config.bundleId}://`)

  // Routes
  addRoute('/', () => {
    Navigation.dismissAllModals()
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 1,
      },
    })
  })

  addRoute('/inbox', () => {
    Navigation.dismissAllModals()
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 0,
      },
    })
  })

  addRoute('/wallet', () => {
    Navigation.dismissAllModals()
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 2,
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

  addRoute('/wallet/:passId', async ({ passId, fromId, toId, item }: any) => {
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 2,
      },
    })
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

  addRoute('/inbox/:docId', async ({ docId }: any) => {
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 0,
      },
    })
    // ensure INBOX_SCREEN doesn't already have same screen with same componentId etc.
    await Navigation.popToRoot('INBOX_SCREEN')
    await Navigation.push('INBOX_TAB', {
      component: {
        name: ComponentRegistry.DocumentDetailScreen,
        passProps: {
          docId,
        },
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
}
