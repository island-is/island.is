import { Navigation } from 'react-native-navigation'
import { preferencesStore } from '../stores/preferences-store'
import { getMainRoot } from './lifecycle/get-app-root'
import { ComponentRegistry } from './navigation-registry'

export function isOnboarded() {
  return getOnboardingScreens().length === 0;
}

export function getOnboardingScreens() {
  const {
    hasOnboardedNotifications,
    hasOnboardedPinCode,
  } = preferencesStore.getState()
  const screens = []

  screens.push({
    component: {
      name: ComponentRegistry.OnboardingAppLockScreen,
      id: 'ONBOARDING_APP_LOCK_SCREEN',
    },
  })

  // show set pin code screen
  if (!hasOnboardedPinCode) {
    return screens
  }

  screens.push({
    component: {
      name: ComponentRegistry.OnboardingNotificationsScreen,
      id: 'ONBOARDING_NOTIFICATIONS_SCREEN',
    },
  })

  // show notifications accept screen
  if (!hasOnboardedNotifications) {
    return screens
  }

  return [];
}

export function nextOnboardingStep() {
  const screens = getOnboardingScreens()
  if (screens.length === 0) {
    Navigation.setRoot({ root: getMainRoot() })
    return
  }

  if (screens.length === 1) {
    Navigation.push('LOGIN_SCREEN', screens[0]);
    return;
  }

  const[currentScreen, nextScreen] = screens.slice(-2);
  Navigation.push(currentScreen.component.id, nextScreen);
}
