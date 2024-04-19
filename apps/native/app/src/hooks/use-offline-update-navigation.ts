import { useNetInfo } from '@react-native-community/netinfo'
import { theme } from '@ui'
import { useEffect } from 'react'
import { Navigation, OptionsTopBar } from 'react-native-navigation'

import { useOfflineStore } from '../stores/offline-store'
import { ButtonRegistry } from '../utils/component-registry'
import { testIDs } from '../utils/test-ids'

export const offlineButton = {
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

export const useOfflineUpdateNavigation = (
  componentId: string,
  optionsTopBarRightButtons: OptionsTopBar['rightButtons'] = [],
  extraProps?: Record<string, unknown>,
) => {
  const netInfo = useNetInfo()
  const pastIsConnected = useOfflineStore(
    ({ pastIsConnected }) => pastIsConnected,
  )
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const resetConnectionState = useOfflineStore(
    ({ resetConnectionState }) => resetConnectionState,
  )

  const updateNavigationButtons = () => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: isConnected
          ? optionsTopBarRightButtons
          : optionsTopBarRightButtons
          ? [...optionsTopBarRightButtons, offlineButton]
          : [offlineButton],
      },
    })
  }

  useEffect(() => {
    if (!isConnected || (isConnected && isConnected !== pastIsConnected)) {
      // Update the navigation top bar right buttons with additional offline button
      // or remove it if the user is connected
      updateNavigationButtons()
    }
  }, [isConnected])

  useEffect(() => {
    if (netInfo.isConnected && !pastIsConnected) {
      resetConnectionState()
    }
  }, [netInfo.isConnected])

  useEffect(() => {
    if (extraProps) {
      // Make sure update the navigation buttons if extra props are passed
      updateNavigationButtons()
    }
  }, [extraProps])
}
