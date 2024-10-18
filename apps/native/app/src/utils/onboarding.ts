import {
  hasHardwareAsync,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'

import { Platform } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { isIos } from './devices'
import { androidIsVersion33OrAbove } from './versions-check'
import { preferencesStore } from '../stores/preferences-store'
import { ComponentRegistry } from './component-registry'
import { getMainRoot } from './get-main-root'

export function isOnboarded() {
  const {
    hasOnboardedNotifications,
    hasOnboardedBiometrics,
    hasOnboardedPinCode,
  } = preferencesStore.getState()

  return (
    hasOnboardedBiometrics &&
    (Platform.OS === 'android' || hasOnboardedNotifications) &&
    hasOnboardedPinCode
  )
}

export async function getOnboardingScreens() {
  const {
    hasOnboardedNotifications,
    hasOnboardedBiometrics,
    hasOnboardedPinCode,
  } = preferencesStore.getState()
  const screens = []

  screens.push({
    component: {
      id: ComponentRegistry.OnboardingPinCodeScreen,
      name: ComponentRegistry.OnboardingPinCodeScreen,
    },
  })

  // show set pin code screen
  if (!hasOnboardedPinCode) {
    return screens
  }

  const hasHardware = await hasHardwareAsync()
  const isEnrolled = await isEnrolledAsync()
  const supportedAuthenticationTypes = await supportedAuthenticationTypesAsync()

  if (hasHardware) {
    // biometrics screen
    screens.push({
      component: {
        id: ComponentRegistry.OnboardingBiometricsScreen,
        name: ComponentRegistry.OnboardingBiometricsScreen,
        passProps: {
          hasHardware,
          isEnrolled,
          supportedAuthenticationTypes,
        },
      },
    })

    // show enable biometrics screen
    if (!hasOnboardedBiometrics) {
      return screens
    }
  } else {
    preferencesStore.setState({
      hasOnboardedBiometrics: true,
    })
  }

  // Android needs upfront Notifications permissions in version 33 and above
  if (isIos || androidIsVersion33OrAbove()) {
    screens.push({
      component: {
        id: ComponentRegistry.OnboardingNotificationsScreen,
        name: ComponentRegistry.OnboardingNotificationsScreen,
      },
    })

    // show notifications accept screen
    if (!hasOnboardedNotifications) {
      return screens
    }
  }

  return []
}

export async function nextOnboardingStep() {
  const screens = await getOnboardingScreens()

  if (screens.length === 0) {
    Navigation.setRoot({ root: getMainRoot() })
    return
  }

  if (screens.length === 1) {
    Navigation.push(ComponentRegistry.LoginScreen, screens[0])
    return
  }

  const [currentScreen, nextScreen] = screens.slice(-2)
  Navigation.push(currentScreen.component.id, nextScreen)
}
