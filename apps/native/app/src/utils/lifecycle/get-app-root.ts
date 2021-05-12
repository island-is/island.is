import { Layout, OptionsTopBarButton } from 'react-native-navigation'
import { getThemeWithPreferences } from '../../contexts/theme-provider'
import { checkIsAuthenticated } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { config } from '../config'
import { ButtonRegistry, ComponentRegistry } from '../navigation-registry'
import { getOnboardingScreens } from '../onboarding'
import { testIDs } from '../test-ids'

/**
 * Select the appropriate app root
 * @returns Layout
 */
export async function getAppRoot(): Promise<Layout> {
  // Check if user is authenticated
  const isAuthenticated = await checkIsAuthenticated()
  const onboardingScreens = await getOnboardingScreens();
  const isOnboarding = isAuthenticated && onboardingScreens.length > 0

  // Show login screen if not authenticated
  // And if not onboarded yet, show those screens
  if (!isAuthenticated || isOnboarding) {
    return {
      stack: {
        id: 'LOGIN_STACK',
        children: [
          {
            component: {
              name: ComponentRegistry.LoginScreen,
              id: 'LOGIN_SCREEN',
            },
          },
        ].concat(isAuthenticated ? onboardingScreens : []),
      },
    }
  }

  const { dev__useLockScreen } = preferencesStore.getState();

  if (dev__useLockScreen === false) {
    return getMainRoot()
  }

  // Show app lock screen if authenticated
  return {
    component: {
      name: ComponentRegistry.AppLockScreen,
      passProps: { isRoot: true, status: 'active' },
    },
  }
}

/**
 * Main root layout, with tabbar
 * @returns Layout
 */
export function getMainRoot(): Layout {
  const theme = getThemeWithPreferences(preferencesStore.getState())
  const rightButtons: OptionsTopBarButton[] = [
    {
      id: ButtonRegistry.UserButton,
      testID: testIDs.TOPBAR_USER_BUTTON,
      // component: {
      //   id: ButtonRegistry.UserButton,
      //   name: ComponentRegistry.NavigationBarButton,
      // },
      icon: require('../../assets/icons/topbar-user.png'),
      disableIconTint: true,
      iconBackground: {
        color: 'transparent',
        cornerRadius: 4,
        width: 32,
        height: 32,
      },
    },
    {
      id: ButtonRegistry.NotificationsButton,
      testID: testIDs.TOPBAR_NOTIFICATIONS_BUTTON,
      // component: {
      //   id: ButtonRegistry.NotificationsButton,
      //   name: ComponentRegistry.NavigationBarButton,
      //   passProps: {
      //     buttonType: 'notifications',
      //   },
      // },
      icon: require('../../assets/icons/topbar-notifications.png'),
      disableIconTint: true,
      iconBackground: {
        color: 'transparent',
        cornerRadius: 4,
        width: 32,
        height: 32,
      },
      // text: 'Notifications',
      // icon: require('../../assets/icons/topbar-notification.png'),
      // disableIconTint: true,
      // iconBackground: {
      //   color: '#ffffff',
      //   cornerRadius: 8,
      // },

    },
  ];

  return {
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
                ...(theme.isDark ? { iconColor: theme.color.white } : {}),
              },
            },
          },
        },
      ],
    },
  }
}
