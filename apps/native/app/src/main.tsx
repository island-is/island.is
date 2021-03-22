import { Home } from './screens/home/home'
import { Navigation, LayoutRoot } from 'react-native-navigation'
import { Inbox } from './screens/inbox/inbox'
import { Wallet } from './screens/wallet/wallet'
import { User } from './screens/user/user'
import { Login } from './screens/login/login'
import { NavigationProvider } from 'react-native-navigation-hooks'
import React from 'react'
import { checkIsAuthenticated } from './auth/auth'
import { config } from './utils/config'

function registerScreen(name: string, Component: React.FunctionComponent) {
  Navigation.registerComponent(
    name,
    () => (props) => {
      return (
        <NavigationProvider value={{ componentId: props.componentId }}>
          <Component {...props} />
        </NavigationProvider>
      )
    },
    () => Component,
  )
}

if (config.storybookMode) {
  registerScreen(
    'is.island.StorybookScreen',
    require('./screens/storybook/storybook').Storybook,
  )
} else {
  registerScreen('is.island.Login', Login)
  registerScreen('is.island.HomeScreen', Home)
  registerScreen('is.island.InboxScreen', Inbox)
  registerScreen('is.island.WalletScreen', Wallet)
  registerScreen('is.island.UserScreen', User)
}

// login screen
const loginRoot = {
  root: {
    component: {
      name: 'is.island.Login',
    },
  },
}

// register root
Navigation.events().registerAppLaunchedListener(async () => {
  if (config.storybookMode) {
    Navigation.setRoot({
      root: { component: { name: 'is.island.StorybookScreen' } },
    })
  } else {
    const isAuthenticated = await checkIsAuthenticated()
    Navigation.setRoot(isAuthenticated ? mainRoot : loginRoot)
  }
})

// show user screen
Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
  console.log('pressed', buttonId)
  if (buttonId === 'userButton') {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: 'is.island.UserScreen',
            },
          },
        ],
      },
    })
  }
})

// bottom tabs
export const mainRoot: LayoutRoot = {
  root: {
    bottomTabs: {
      id: 'BOTTOM_TABS_LAYOUT',
      options: {
        bottomTabs: {
          currentTabIndex: 1,
        },
      },
      children: [
        {
          stack: {
            id: 'INBOX_TAB',
            children: [
              {
                component: {
                  id: 'INBOX_SCREEN',
                  name: 'is.island.InboxScreen',
                },
              },
            ],
            options: {
              bottomTab: {
                selectedIconColor: '#0061ff',
                icon: {
                  system: 'tray',
                },
              },
              topBar: {
                largeTitle: {
                  visible: true,
                },
              },
            },
          },
        },
        {
          stack: {
            id: 'HOME_TAB',
            children: [
              {
                component: {
                  id: 'HOME_SCREEN',
                  name: 'is.island.HomeScreen',
                },
              },
            ],
            options: {
              bottomTab: {
                icon: require('./assets/tabbar-icon-home.png'),
                selectedIcon: require('./assets/tabbar-icon-home.png'),
              },
            },
          },
        },
        {
          stack: {
            id: 'WALLET_TAB',
            children: [
              {
                component: {
                  id: 'WALLET_SCREEN',
                  name: 'is.island.WalletScreen',
                },
              },
            ],
            options: {
              bottomTab: {
                selectedIconColor: '#0061ff',
                icon: {
                  system: 'wallet.pass',
                },
              },
            },
          },
        },
      ],
    },
  },
}

// native navigation options
Navigation.setDefaultOptions({
  topBar: {
    animate: true,
    title: {
      color: '#13134b',
    },
    backButton: {
      color: '#13134b',
    },
    background: {
      color: '#f2f7ff',
    },
    borderHeight: 0,
    borderColor: 'transparent',
    rightButtons: [
      {
        id: 'userButton',
        text: 'User',
        icon: {
          system: 'person.crop.circle',
        },
      },
    ],
  },
  bottomTabs: {
    elevation: 0,
    borderWidth: 0,
    hideShadow: true,
    titleDisplayMode: 'alwaysHide',
  },
  bottomTab: {
    fontSize: 28,
    selectedFontSize: 18,
    selectedTextColor: '#0061ff',
  },
})
