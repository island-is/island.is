import { ActionSheetIOS, DevSettings, Platform } from 'react-native'
import DialogAndroid from 'react-native-dialogs'
import { Navigation } from 'react-native-navigation'
import { authStore } from '../../stores/auth-store'
import { preferencesStore } from '../../stores/preferences-store'
import { ComponentRegistry } from '../component-registry'
import { getAppRoot } from './get-app-root'

const devMenuOptions = {
  storybook: false,
}

function toggleLockScreen() {
  const { dev__useLockScreen } = preferencesStore.getState()
  preferencesStore.setState({ dev__useLockScreen: !dev__useLockScreen })
}

async function toggleStorybook() {
  if (devMenuOptions.storybook) {
    Navigation.setRoot({ root: await getAppRoot() })
  } else {
    Navigation.setRoot({
      root: {
        component: {
          name: ComponentRegistry.DevtoolsStorybookScreen,
        },
      },
    })
  }
  devMenuOptions.storybook = !devMenuOptions.storybook
}

async function resetPreferences() {
  await preferencesStore.getState().reset()
}

async function enforceLogout() {
  await authStore.getState().logout()
  Navigation.setRoot({ root: await getAppRoot() })
}

function toggleLanguage() {
  const { locale, setLocale } = preferencesStore.getState()
  setLocale(locale === 'en-US' ? 'is-IS' : 'en-US')
}

export function setupDevMenu() {
  if (!__DEV__) {
    return null
  }

  DevSettings.addMenuItem('Ísland Dev Menu', () => {
    const { dev__useLockScreen } = preferencesStore.getState()

    const options = {
      STORYBOOK: devMenuOptions.storybook
        ? 'Disable Storybook'
        : 'Enable Storybook',
      TOGGLE_LOCKSCREEN: dev__useLockScreen
        ? 'Disable lockscreen'
        : 'Enable Lockscreen',
      TOGGLE_LANGUAGE: 'Toggle language',
      RESET_PREFERENCES: 'Reset preferences',
      LOGOUT: 'Logout',
    }

    const objectEntries = Object.entries(options)
    const objectKeys = Object.keys(options)
    const objectValues = Object.values(options)

    const handleOption = (optionKey: string) => {
      switch (optionKey) {
        case 'TOGGLE_LOCKSCREEN':
          return toggleLockScreen()
        case 'TOGGLE_LANGUAGE':
          return toggleLanguage()
        case 'STORYBOOK':
          return toggleStorybook()
        case 'RESET_PREFERENCES':
          return resetPreferences()
        case 'LOGOUT':
          return enforceLogout()
      }
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...objectValues, 'Cancel'],
          cancelButtonIndex: objectKeys.length,
        },
        (buttonIndex: number) => {
          const optionKey = objectKeys[buttonIndex]
          handleOption(optionKey)
        },
      )
    } else if (Platform.OS === 'android') {
      DialogAndroid.showPicker('Ísland Dev Menu', null, {
        items: objectEntries.map((entry) => ({
          label: entry[1],
          id: entry[0],
        })),
      }).then(({ selectedItem }: any) => {
        if (selectedItem?.id) {
          handleOption(selectedItem.id)
        }
      })
    }
  })
}
