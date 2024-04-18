import { useEffect } from 'react'
import { Navigation, OptionsTopBar } from 'react-native-navigation'

import { useOfflineStore } from '../stores/offline-store'
import { preferencesStore } from '../stores/preferences-store'
import {
  ButtonRegistry,
  ComponentRegistry as CR,
} from '../utils/component-registry'
import { getThemeWithPreferences } from '../utils/get-theme-with-preferences'
import { testIDs } from '../utils/test-ids'

export const getOfflineButton = () => {
  const theme = getThemeWithPreferences(preferencesStore.getState())

  return {
    accessibilityLabel: 'Offline',
    id: ButtonRegistry.OfflineButton,
    testID: testIDs.TOPBAR_OFFLINE_BUTTON,
    icon: require('../assets/icons/warning.png'),
    iconBackground: {
      color: 'transparent',
      cornerRadius: 8,
      width: theme.spacing[4],
      height: theme.spacing[4],
    },
  }
}

export const useOfflineUpdateNavigation = (
  componentId: string,
  optionsTopBarRightButtons: OptionsTopBar['rightButtons'],
) => {
  const pastIsConnected = useOfflineStore(
    ({ pastIsConnected }) => pastIsConnected,
  )
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const currentComponentId = useOfflineStore(
    ({ currentComponentId }) => currentComponentId,
  )
  const setCurrentComponentId = useOfflineStore(
    ({ setCurrentComponentId }) => setCurrentComponentId,
  )
  const showBanner = useOfflineStore(({ showBanner }) => showBanner)
  const bannerHasBeenShown = useOfflineStore(
    ({ bannerHasBeenShown }) => bannerHasBeenShown,
  )
  const setBannerHasBeenShown = useOfflineStore(
    ({ setBannerHasBeenShown }) => setBannerHasBeenShown,
  )

  const updateNavigationOptions = () => {
    const offlineButton = getOfflineButton()
    // Update the navigation options
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: isConnected
          ? optionsTopBarRightButtons
          : optionsTopBarRightButtons
          ? [...optionsTopBarRightButtons, offlineButton]
          : [offlineButton],
      },
    })

    if (!showBanner && !bannerHasBeenShown && !isConnected) {
      void Navigation.showOverlay({
        component: {
          id: CR.OfflineBanner,
          name: CR.OfflineBanner,
        },
      })
      setBannerHasBeenShown(true)
    }
  }

  useEffect(() => {
    if (currentComponentId === componentId && isConnected !== pastIsConnected) {
      updateNavigationOptions()
    }
  }, [isConnected, currentComponentId])

  useEffect(() => {
    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({ componentId, componentName, passProps }) => {
          // Only update the current component id if it's a screen
          if (componentId.includes('.screens.')) {
            setCurrentComponentId(componentId)
          }
        },
      )

    return () => {
      screenEventListener.remove()
    }
  }, [])
}
