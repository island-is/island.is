import React from 'react'
import { AppState, AppStateStatus, Text, View } from 'react-native';
import { Navigation, LayoutRoot, NavigationFunctionComponent } from 'react-native-navigation'
import { NavigationProvider } from 'react-native-navigation-hooks'
import { Home } from './screens/home/home'
import { Inbox } from './screens/inbox/inbox'
import { Wallet } from './screens/wallet/wallet'
import { User } from './screens/user/user'
import { Login } from './screens/login/login'
import { theme } from '@island.is/island-ui/theme'
import { authStore, checkIsAuthenticated } from './auth/auth'
import { config } from './utils/config'
import { LockScreen } from './screens/lockscreen/lockscreen';
import { authenticateAsync } from 'expo-local-authentication';

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
  },
  bottomTabs: {
    elevation: 0,
    borderWidth: 0,
    hideShadow: true,
    titleDisplayMode: 'alwaysHide'
  },
})

let lockScreenComponentId: string | undefined;
let isAuthenticating: boolean = false;

AppState.addEventListener("change", (status: AppStateStatus) => {
  console.log('status', status);
  if (!authStore.getState().userInfo) {
    console.log('no auth, fail');
    return;
  }
  if (isAuthenticating) {
    console.log('authenticating, waiting');
    return;
  }
  if (status === 'background' || status === 'inactive') {
    if (!lockScreenComponentId) {
      Navigation.showOverlay({
        component: {
          id: 'LOCK_SCREEN',
          name: 'is.island.LockScreen'
        }
      }).then(componentId => {
        lockScreenComponentId = componentId;
      })
    }
  } else {
    if (lockScreenComponentId) {
      isAuthenticating = true;
      authenticateAsync()
      .then((response) => {
        if (response.success && lockScreenComponentId) {
          Navigation.dismissOverlay(lockScreenComponentId).then(() => {
            lockScreenComponentId = undefined;
          });
        }
        isAuthenticating = false;
      })
    }
  }
});

function registerScreen(name: string, Component: NavigationFunctionComponent) {
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


const TitleComponent = ({ title }: any) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
  <Text style={{
    color: theme.color.blue600,
    fontSize: 19,
    fontWeight: '700',
    paddingLeft: 16
   }}>{title}</Text>
   </View>
);


if (config.storybookMode) {
  registerScreen(
    'is.island.StorybookScreen',
    require('./screens/storybook/storybook').Storybook,
  )
} else {
  Navigation.registerComponent('is.island.TitleComponent', () => TitleComponent);
  registerScreen('is.island.Login', Login)
  registerScreen('is.island.HomeScreen', Home)
  registerScreen('is.island.InboxScreen', Inbox)
  registerScreen('is.island.WalletScreen', Wallet)
  registerScreen('is.island.UserScreen', User)
  registerScreen('is.island.LockScreen', LockScreen)
}

// login screen
export const loginRoot = {
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
    // Navigation.setRoot(loginRoot)
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

const rightButtons = [
  {
    id: 'userButton',
    text: 'User',
    icon: {
      system: 'person.crop.circle',
    },
  },
];

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
                selectedIconColor: theme.color.blue400,
                icon: require('./assets/icons/tabbar-inbox.png'),
                selectedIcon: require('./assets/icons/tabbar-inbox-selected.png'),
              },
              topBar: {
                largeTitle: {
                  visible: true,
                },
                rightButtons,
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
                icon: require('./assets/icons/tabbar-home.png'),
                selectedIcon: require('./assets/icons/tabbar-home-selected.png'),
              },
              topBar: {
                rightButtons,
              }
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
              topBar: {
                rightButtons,
              },
              bottomTab: {
                testID: 'MAIN_TABS_WALLET_TAB',
                text: 'Wallet',
                selectedIconColor: theme.color.blue400,
                icon: require('./assets/icons/tabbar-wallet.png'),
                selectedIcon: require('./assets/icons/tabbar-wallet-selected.png'),
              },
            },
          },
        },
      ],
    },
  },
}
