import { Layout, OptionsTopBarButton } from 'react-native-navigation'
import { notificationsStore } from '../stores/notifications-store'
import { preferencesStore } from '../stores/preferences-store'
import {
  ButtonRegistry,
  ComponentRegistry,
  MainBottomTabs,
  StackRegistry,
} from './component-registry'
import { getThemeWithPreferences } from './get-theme-with-preferences'
import { testIDs } from './test-ids'

type Icons = 'notifications' | 'settings' | 'licenseScan' | 'options' | 'dots'

type RightButtonProps = {
  unseenCount?: number
  theme?: ReturnType<typeof getThemeWithPreferences>
  icons?: Icons[]
}

export const getRightButtons = ({
  unseenCount = notificationsStore.getState().unseenCount,
  theme = getThemeWithPreferences(preferencesStore.getState()),
  icons,
}: RightButtonProps = {}): OptionsTopBarButton[] => {
  if (!icons) {
    return []
  }

  const iconBackground = {
    color: 'transparent',
    cornerRadius: 4,
    width: theme.spacing[4],
    height: theme.spacing[4],
  }

  const rightButtons: OptionsTopBarButton[] = []

  // Note: the first icon in the array will be displayed in top right corner
  icons.forEach((icon) => {
    if (icon === 'notifications') {
      rightButtons.push({
        accessibilityLabel: 'Notifications',
        id: ButtonRegistry.NotificationsButton,
        testID: testIDs.TOPBAR_NOTIFICATIONS_BUTTON,
        icon:
          unseenCount > 0
            ? require('../assets/icons/topbar-notifications-bell.png')
            : require('../assets/icons/topbar-notifications.png'),
        iconBackground,
      })
    } else if (icon === 'settings') {
      rightButtons.push({
        accessibilityLabel: 'Settings',
        id: ButtonRegistry.SettingsButton,
        testID: testIDs.TOPBAR_SETTINGS_BUTTON,
        icon: require('../assets/icons/settings.png'),
        iconBackground,
      })
    } else if (icon === 'licenseScan') {
      rightButtons.push({
        id: ButtonRegistry.ScanLicenseButton,
        testID: testIDs.TOPBAR_SCAN_LICENSE_BUTTON,
        icon: require('../assets/icons/navbar-scan.png'),
        color: theme.color.blue400,
        iconBackground,
      })
    } else if (icon === 'options') {
      rightButtons.push({
        id: ButtonRegistry.HomeScreenOptionsButton,
        testID: testIDs.TOPBAR_HOME_OPTIONS_BUTTON,
        icon: require('../assets/icons/options.png'),
        color: theme.color.blue400,
        iconBackground,
      })
    } else if (icon === 'dots') {
      rightButtons.push({
        id: ButtonRegistry.HomeScreenDropdownButton,
        testID: testIDs.TOPBAR_DROPDOWN_BUTTON,
        icon: require('../assets/icons/Ellipsis-vertical.png'),
        color: theme.color.blue400,
        iconBackground,
      })
    }
  })
  return rightButtons
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
          currentTabIndex: 2,
          tabsAttachMode: 'onSwitchToTab',
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
            id: StackRegistry.HealthStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.HealthOverviewScreen,
                  name: ComponentRegistry.HealthOverviewScreen,
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
            id: StackRegistry.MoreStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.MoreScreen,
                  name: ComponentRegistry.MoreScreen,
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
