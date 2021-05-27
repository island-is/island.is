import { Layout, OptionsTopBarButton } from 'react-native-navigation'
import { ButtonRegistry, ComponentRegistry } from './component-registry'
import { testIDs } from './test-ids'

export const rightButtons: OptionsTopBarButton[] = [
  {
    accessibilityLabel: 'User',
    id: ButtonRegistry.UserButton,
    testID: testIDs.TOPBAR_USER_BUTTON,
    icon: require('../../assets/icons/topbar-user.png'),
    iconBackground: {
      color: 'transparent',
      cornerRadius: 8,
      width: 32,
      height: 32,
    },
  },
  {
    accessibilityLabel: 'Notifications',
    id: ButtonRegistry.NotificationsButton,
    testID: testIDs.TOPBAR_NOTIFICATIONS_BUTTON,
    icon: require('../../assets/icons/topbar-notifications.png'),
    iconBackground: {
      color: 'transparent',
      cornerRadius: 8,
      width: 32,
      height: 32,
    },
  },
]

/**
 * Main root layout, with tabbar
 * @returns Layout
 */
export function getMainRoot(): Layout {
  return {
    bottomTabs: {
      id: 'BOTTOM_TABS_LAYOUT',
      options: {
        bottomTabs: {
          testID: testIDs.TABBAR_MAIN,
          currentTabIndex: 1,
          tabsAttachMode: 'together'
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
            },
          },
        },
      ],
    },
  }
}
