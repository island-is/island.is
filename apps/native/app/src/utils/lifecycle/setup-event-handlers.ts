import { AppState, AppStateStatus } from "react-native"
import { Navigation } from "react-native-navigation"
import { authStore } from "../../stores/auth-store"
import { config } from "../config"
import { navigateTo } from "../deep-linking"
import { ButtonRegistry, ComponentRegistry } from "../navigation-registry"

const LOCK_SCREEN_TIMEOUT = 5000;

export function setupEventHandlers() {
  AppState.addEventListener('change', (status: AppStateStatus) => {
    const { lockScreenComponentId, lockScreenActivatedAt, userInfo } = authStore.getState();

    if (!userInfo) {
      return
    }

    // Lockscreen related
    if (!config.disableLockScreen) {
      if (status === 'active') {
        if (lockScreenComponentId) {
          if (lockScreenActivatedAt !== undefined && lockScreenActivatedAt + LOCK_SCREEN_TIMEOUT > Date.now()) {
            Navigation.dismissOverlay(lockScreenComponentId);
          } else {
            Navigation.updateProps(lockScreenComponentId, { status })
          }
        }
      }

      if (status === 'background' || status === 'inactive') {
        if (!lockScreenComponentId) {
          Navigation.showOverlay({
            component: { name: ComponentRegistry.AppLockScreen, passProps: { isRoot: false, status } }
          })
        } else {
          Navigation.updateProps(lockScreenComponentId, { status })
        }
      }
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
