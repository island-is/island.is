import { Navigation } from 'react-native-navigation'
import { config } from '../config'
import { addRoute, addScheme } from '../deep-linking'
import { ComponentRegistry } from '../navigation-registry'
import { getMainRoot } from './get-app-root'

export function setupDeepLinkingRouter() {
  // Setup app scheme (is.island.app://)
  addScheme(`${config.bundleId}://`)

  // Routes
  addRoute('/', (...x) => {
    console.log('home', x)
    Navigation.setRoot({ root: getMainRoot() })
  })

  addRoute('/inbox', () => {
    console.log('inbox')
  })
  addRoute('/wallet', (...x) => {
    console.log('wallet', x)
  })

  addRoute('/setnotification', (...x) => {
    console.log('set notification', x)
    Navigation.push('ONBOARDING', {
      component: {
        name: ComponentRegistry.SetNotifications,
      },
    })
  })

  addRoute('/wallet/:passId', ({ passId, backgroundColor = '#f5e4ec' }: any) => {
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 2,
      },
    })
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: ComponentRegistry.WalletPassScreen,
            passProps: {
              id: passId,
            },
            options: {
              layout: {
                componentBackgroundColor: backgroundColor
              }
            }
          },
        }],
      }
    })
  });

  addRoute('/inbox/:docId', ({ docId }: any) => {
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 0,
      },
    });
    // ensure INBOX_SCREEN doesn't already have same screen with same componentId etc.
    Navigation.popToRoot('INBOX_SCREEN', {
      animations: {
        pop: {
          enabled: false,
        }
      }
    })
    .then(() => {
      Navigation.push('INBOX_TAB', {
        component: {
          name: ComponentRegistry.DocumentDetailScreen,
          passProps: {
            docId,
          },
        },
      })
    });
  });

  addRoute('/user', () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.UserScreen
            },
          },
        ],
      },
    })
  })
}
