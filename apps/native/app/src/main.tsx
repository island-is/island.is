import { Alert, Appearance, AppState, AppStateStatus, StatusBar } from 'react-native'
import { Navigation, LayoutRoot, Options, OptionsTopBarButton } from 'react-native-navigation'
import { theme } from '@island.is/island-ui/theme'
import { authStore, checkIsAuthenticated } from './auth/auth'
import { config } from './utils/config'
import { authenticateAsync, AuthenticationType, supportedAuthenticationTypesAsync } from 'expo-local-authentication'
import { addRoute, addScheme, navigateTo } from './utils/deep-linking'
import { ComponentRegistry } from './utils/navigation-registry'
import { ButtonRegistry } from './utils/navigation-registry'
import { registerAllComponents } from './screens'
import { testIDs } from './utils/test-ids'

// Register all components and screens
registerAllComponents()

function registerEventListeners() {
  // @todo create a shared store with navigation stack hierarcy

  Navigation.events().registerCommandListener((...args) => {
    console.log('registerCommandListener', args)
  })
  Navigation.events().registerScreenPoppedListener((...args) => {
    console.log('registerScreenPoppedListener', args)
  })
  Navigation.events().registerCommandCompletedListener((...args) => {
    console.log('registerCommandCompletedListener', args)
  })
  Navigation.events().registerComponentDidAppearListener((...args) => {
    console.log('registerComponentDidAppearListener', args)
  })
  Navigation.events().registerModalDismissedListener((...args) => {
    console.log('registerModalDismissedListener', args)
  })
  Navigation.events().registerModalAttemptedToDismissListener((...args) => {
    console.log('registerModalAttemptedToDismissListener', args)
  })

  // deep linking
  addScheme(`${config.bundleId}://`)
  addRoute('/inbox', () => {
    console.log('inbox')
  })
  addRoute('/', () => {
    console.log('home')
  })
  addRoute('/wallet', (...x) => {
    console.log('wallet', x)
  })

  addRoute('/wallet/:passId', ({ passId }: any) => {
    Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
      bottomTabs: {
        currentTabIndex: 2,
      },
    })
    // ensure WALLET_SCREEN doesn't already have same screen with same componentId etc.
    Navigation.popToRoot('WALLET_SCREEN', {
      animations: {
        pop: {
          enabled: false,
        },
      },
    }).then(() => {
      Navigation.push('WALLET_TAB', {
        component: {
          name: ComponentRegistry.WalletPassScreen,
          passProps: {
            passId,
          },
        },
      })
    });
  })

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


  // Appearance.addChangeListener(({ colorScheme }) => {
  //   Navigation.setDefaultOptions(getDefaultOptions(colorScheme));
  // })

  // app change events
  AppState.addEventListener('change', (status: AppStateStatus) => {
    if (!authStore.getState().userInfo) {
      return
    }

    if (status === 'active' && isAuthenticating) {
      isAuthenticating = false
      return
    }

    if (status === 'background' || status === 'inactive') {
      showLockScreen()
    }

    if (status === 'active') {
      showFaceID()
    }
  })

  // show user screen
  Navigation.events().registerNavigationButtonPressedListener(
    ({ buttonId }) => {
      if (buttonId === ButtonRegistry.UserButton) {
        navigateTo('/user')
      }
    },
  )
}

const overwriteColorScheme = 'light';

function getDefaultOptions(colorScheme = overwriteColorScheme ?? Appearance.getColorScheme()) {
  const isDark = colorScheme === 'dark';
  StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content')
  return {
    topBar: {
      background: isDark ? {
        translucent: true,
        color: null as any,
      } : {
        translucent: false,
        color: theme.color.blue100,
      },
      barStyle: isDark ? 'black' : 'default',
      backButton: {
        color: theme.color.blue400,
      },
      title: {
        fontFamily: 'IBMPlexSans-SemiBold',
        fontSize: 19,
        color: theme.color.blue400,
      },
      animate: true,
      borderHeight: 0,
      borderColor: 'transparent',
    },
    window: {
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
    layout: {
      backgroundColor: isDark ? '#000000' : '#ffffff',
      componentBackgroundColor: isDark ? '#000000' : '#ffffff',
    },
    bottomTabs: {
      elevation: 0,
      borderWidth: 0,
      hideShadow: true,
      titleDisplayMode: 'alwaysHide',
      translucent: isDark ? true : false,
      backgroundColor: isDark ? null as any : '#ffffff'
    },
  } as Options;
}

// native navigation options
Navigation.setDefaultOptions(getDefaultOptions());

let isAuthenticating: boolean = false

function showLockScreen() {
  if (config.disableLockScreen) {
    return Promise.resolve()
  }

  return Navigation.showOverlay({
    component: {
      id: 'LOCK_SCREEN',
      name: ComponentRegistry.AppLockScreen,
    },
  })
}

async function showFaceID() {
  if (config.disableLockScreen) {
    return Promise.resolve()
  }

  isAuthenticating = true

  // supportedAuthenticationTypesAsync().then(t => {
  //   if (t.includes(AuthenticationType.FACIAL_RECOGNITION)) {
  //     console.log('facial recognition');
  //   } else if (t.includes(AuthenticationType.FINGERPRINT)) {
  //     console.log('fingerprint');
  //   } else if (t.includes(AuthenticationType.IRIS)) {
  //     console.log('iris');
  //   }
  // });

  return authenticateAsync()
    .then((response) => {
      console.log({ response });
      if (response.success) {
        Navigation.dismissAllOverlays()
      } else {
        // @todo make this stronger and cross platform
        if ((response as any).error === 'not_enrolled') {
          Alert.alert('Not entrolled', 'You have not enrolled into biometrics. Go to settings in your phone and add them');
        } else if ((response as any).error === 'lockout') {
          Alert.alert('Too many attempts', 'Too many attempts. Try again later.');
        }
        isAuthenticating = false
      }
    })
    .catch((err) => {
      console.log('FaceID failure', err)
    })
}

// register root
Navigation.events().registerAppLaunchedListener(async () => {
  registerEventListeners()
  if (config.storybookMode) {
    Navigation.setRoot({
      root: { component: { name: ComponentRegistry.StorybookScreen } },
    })
  } else {
    const isAuthenticated = await checkIsAuthenticated()
    await Navigation.setRoot(isAuthenticated ? mainRoot : loginRoot)
    if (isAuthenticated) {
      await showLockScreen()
      await showFaceID();
    }
  }
})

// login screen
export const loginRoot = {
  root: {
    component: {
      name: ComponentRegistry.LoginScreen,
    },
  },
}

const rightButtons: OptionsTopBarButton[] = [
  {
    id: ButtonRegistry.UserButton,
    testID: testIDs.TOPBAR_USER_BUTTON,
    text: 'User',
    icon: {
      system: 'person.crop.circle',
    },
  },
]

export function getMainRoot() {
  const colorScheme = overwriteColorScheme ?? Appearance.getColorScheme()
  const isDark = colorScheme !== 'light';
  return {
    root: {
      bottomTabs: {
        id: 'BOTTOM_TABS_LAYOUT',
        options: {
          bottomTabs: {
            testID: testIDs.TABBAR_MAIN,
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
                topBar: {
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
                topBar: {
                  rightButtons,
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
                    name: ComponentRegistry.WalletScreen,
                  },
                },
              ],
              options: {
                topBar: {
                  rightButtons,
                },
                bottomTab: {
                  ...(isDark ? { iconColor: theme.color.white } : {})
                },
              },
            },
          },
        ],
      },
    },
  } as LayoutRoot;
}

export const mainRoot = getMainRoot();
