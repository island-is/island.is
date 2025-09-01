/* eslint-disable @typescript-eslint/naming-convention */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActionSheetIOS, DevSettings } from 'react-native'
import DialogAndroid from 'react-native-dialogs'
import { Navigation } from 'react-native-navigation'
import { authStore } from '../../stores/auth-store'
import { clearAllStorages } from '../../stores/mmkv'
import { preferencesStore } from '../../stores/preferences-store'
import { ComponentRegistry } from '../component-registry'
import { isAndroid, isIos } from '../devices'
import { getAppRoot } from './get-app-root'

const devMenuOptions = {
  storybook: false,
}

function clearAsyncStorage() {
  AsyncStorage.clear()
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

async function loginCognito() {
  Navigation.showModal({
    component: {
      name: ComponentRegistry.DevtoolsCognitoAuthScreen,
      passProps: { url: authStore.getState().cognitoAuthUrl ?? '' },
    },
  })
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
    const { cognitoAuthUrl } = authStore.getState()

    const options = {
      STORYBOOK: devMenuOptions.storybook
        ? 'Disable Storybook'
        : 'Enable Storybook',
      TOGGLE_LOCKSCREEN: dev__useLockScreen
        ? 'Disable lockscreen'
        : 'Enable Lockscreen',
      ...(cognitoAuthUrl
        ? {
            LOGIN_COGNITO: 'Login with cognito',
          }
        : {}),
      TOGGLE_LANGUAGE: 'Toggle language',
      RESET_PREFERENCES: 'Reset preferences',
      CLEAR_ASYNC_STORAGE: 'Clear async storage',
      CLEAR_MKKV: 'Clear MKKV',
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
        case 'LOGIN_COGNITO':
          return loginCognito()
        case 'CLEAR_ASYNC_STORAGE':
          return clearAsyncStorage()
        case 'CLEAR_MKKV':
          return clearAllStorages()
      }
    }

    if (isIos) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...objectValues, 'Cancel'] as string[],
          cancelButtonIndex: objectKeys.length,
        },
        (buttonIndex: number) => {
          const optionKey = objectKeys[buttonIndex]
          handleOption(optionKey)
        },
      )
    } else if (isAndroid) {
      DialogAndroid.showPicker('Ísland Dev Menu', null, {
        items: objectEntries.map((entry) => ({
          label: entry[1],
          id: entry[0],
        })),
      }).then(({ selectedItem }) => {
        if (selectedItem?.id) {
          handleOption(selectedItem.id)
        }
      })
    }
  })
}
