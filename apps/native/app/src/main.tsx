import React from 'react'
import { AppState, AppStateStatus, Linking } from 'react-native';
import { Navigation, LayoutRoot } from 'react-native-navigation'
import { theme } from '@island.is/island-ui/theme'
import { authStore, checkIsAuthenticated } from './auth/auth'
import { config } from './utils/config'
import { authenticateAsync } from 'expo-local-authentication';
import { addRoute, addScheme, evaluateUrl } from './utils/deep-linking';
import { ComponentRegistry } from './utils/navigation-registry';
import { ButtonRegistry } from './utils/navigation-registry';
import { registerAllComponents } from './screens';

registerAllComponents();

function registerEventListeners() {
  // @todo create a shared store with navigation stack hierarcy

  Navigation.events().registerCommandListener((...args) => {
    console.log('registerCommandListener', args);
  });
  Navigation.events().registerScreenPoppedListener((...args) => {
    console.log('registerScreenPoppedListener', args);
  });
  Navigation.events().registerCommandCompletedListener((...args) => {
    console.log('registerCommandCompletedListener', args);
  });
  Navigation.events().registerComponentDidAppearListener((...args) => {
    console.log('registerComponentDidAppearListener', args);
  });
  Navigation.events().registerModalDismissedListener((...args) => {
    console.log('registerModalDismissedListener', args);
  });
  Navigation.events().registerModalAttemptedToDismissListener((...args) => {
    console.log('registerModalAttemptedToDismissListener', args);
  });

  // deep linking
  addScheme(`${config.bundleId}://`);
  addRoute('/inbox', () => {
    console.log('inbox');
  });
  addRoute('/', () => {
    console.log('home')
  });
  addRoute('/wallet', (...x) => {
    console.log('wallet', x);
  });

  addRoute('/wallet/:passId', ({ passId }: any) => {

    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 2,
      },
    });
    // ensure WALLET_SCREEN doesn't already have same screen with same componentId etc.
    Navigation.popToRoot('WALLET_SCREEN', {
      animations: {
        pop: {
          enabled: false,
        }
      }
    })
    .then(() => {
      Navigation.push('WALLET_TAB', {
        component: {
          name: ComponentRegistry.WalletPassScreen,
          passProps: {
            passId,
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
              name: ComponentRegistry.UserScreen,
            },
          },
        ],
      },
    })
  })
  Linking.addEventListener('url', ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        evaluateUrl(url);
      }
    });
  });
  Linking.getInitialURL().then((url) => {
    console.log('initial url', url);
    if (url) {
      Linking.openURL(url);
    }
  })
  .catch(err => console.error('An error occurred', err));

  // app change events
  AppState.addEventListener("change", (status: AppStateStatus) => {
    console.log(authStore.getState());
    if (!authStore.getState().userInfo) {
      return;
    }

    if (status === 'active' && isAuthenticating) {
      isAuthenticating = false;
      return;
    }

    if (status === 'background' || status === 'inactive') {
      showLockScreen();
    }

    if (status === 'active') {
      showFaceID();
    }
  });

  // show user screen
  Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
    if (buttonId === 'userButton') {
      Linking.openURL(`${config.bundleId}://user`);
    }
  })

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
  },
  bottomTabs: {
    elevation: 0,
    borderWidth: 0,
    hideShadow: true,
    titleDisplayMode: 'alwaysHide'
  },
})

let isAuthenticating: boolean = false;

function showLockScreen() {
  if (config.disableLockScreen) {
    return Promise.resolve();
  }

  return Navigation.showOverlay({
    component: {
      id: 'LOCK_SCREEN',
      name: ComponentRegistry.AppLockScreen
    }
  });
}

function showFaceID() {
  if (config.disableLockScreen) {
    return Promise.resolve();
  }

  isAuthenticating = true;
  return authenticateAsync()
  .then((response) => {
    if (response.success) {
      Navigation.dismissAllOverlays()
    } else {
      isAuthenticating = false;
    }
  })
  .catch(err => {
    console.log('FaceID failure', err)
  })
}

// register root
Navigation.events().registerAppLaunchedListener(async () => {
  registerEventListeners();
  if (config.storybookMode) {
    Navigation.setRoot({
      root: { component: { name: ComponentRegistry.StorybookScreen } },
    })
  } else {
    const isAuthenticated = await checkIsAuthenticated()
    Navigation.setRoot(isAuthenticated ? mainRoot : loginRoot)
    if (isAuthenticated) {
      showLockScreen()
      .then(() => showFaceID())
    }
  }
});

// login screen
export const loginRoot = {
  root: {
    component: {
      name: ComponentRegistry.LoginScreen,
    },
  },
}

const rightButtons = [
  {
    id: ButtonRegistry.UserButton,
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
                  name: ComponentRegistry.InboxScreen,
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
                  name: ComponentRegistry.HomeScreen,
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
                  name: ComponentRegistry.WalletScreen,
                },
              },
            ],
            options: {
              topBar: {
                rightButtons,
              },
              bottomTab: {
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
