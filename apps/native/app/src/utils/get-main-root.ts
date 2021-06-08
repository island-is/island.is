import { Layout, OptionsTopBarButton } from 'react-native-navigation'
import { notificationsStore } from '../stores/notifications-store'
import {
  ButtonRegistry,
  ComponentRegistry,
  MainBottomTabs,
  StackRegistry,
} from './component-registry'
import { testIDs } from './test-ids'

export const getRightButtons = ({ unreadCount = notificationsStore.getState().unreadCount } = {}): OptionsTopBarButton[] => {
  return [
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
      icon:
        unreadCount > 0
          ? require('../../assets/icons/topbar-notifications-bell.png')
          : require('../../assets/icons/topbar-notifications.png'),
      iconBackground: {
        color: 'transparent',
        cornerRadius: 8,
        width: 32,
        height: 32,
      },
    },
  ]
}

/**
 * Main root layout, with tabbar
 * @returns Layout
 */
export function getMainRoot(): Layout {
  const rightButtons = getRightButtons()
  return {
    bottomTabs: {
      id: MainBottomTabs,
      options: {
        bottomTabs: {
          testID: testIDs.TABBAR_MAIN,
          currentTabIndex: 1,
          tabsAttachMode: 'together',
        },
      },
      children: [
        {
          stack: {
            id: StackRegistry.InboxStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.InboxScreen,
                  name: ComponentRegistry.InboxScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
        {
          stack: {
            id: StackRegistry.HomeStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.HomeScreen,
                  name: ComponentRegistry.HomeScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
        {
          stack: {
            id: StackRegistry.WalletStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.WalletScreen,
                  name: ComponentRegistry.WalletScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  }
}
