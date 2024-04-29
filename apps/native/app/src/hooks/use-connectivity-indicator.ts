import { QueryResult } from '@apollo/client/react/types/types'
import { useNetInfo } from '@react-native-community/netinfo'
import { theme } from '@ui'
import { useEffect, useState } from 'react'
import { Navigation, OptionsTopBar } from 'react-native-navigation'
import { OptionsTopBarButton } from 'react-native-navigation/lib/src/interfaces/Options'

import { useOfflineActions, useOfflineStore } from '../stores/offline-store'
import { ButtonRegistry as BR } from '../utils/component-registry'
import { isDefined } from '../utils/is-defined'
import { testIDs } from '../utils/test-ids'

export const offlineButton: OptionsTopBarButton = {
  accessibilityLabel: 'Offline',
  id: BR.OfflineButton,
  testID: testIDs.TOPBAR_OFFLINE_BUTTON,
  icon: require('../assets/icons/warning.png'),
  iconBackground: {
    color: 'transparent',
    cornerRadius: 8,
    width: theme.spacing[4],
    height: theme.spacing[4],
  },
}

const loadingButton: OptionsTopBarButton = {
  id: BR.LoadingButton,
  component: {
    id: BR.LoadingButton,
    name: BR.LoadingButton,
    height: theme.spacing[4],
    width: theme.spacing[4],
  },
}

/**
 * `useConnectivityIndicator` is a hook designed to enhance app navigation by dynamically displaying connectivity-related UI elements.
 * It manages the visual indication of the app’s network status by showing a loading spinner when data is being fetched and an offline icon when no internet connection is available.
 * This hook helps improve user experience by providing real-time feedback on the app's connectivity state.
 *
 * @param componentId - The unique ID of the component.
 * @param optionsTopBarRightButtons - The right buttons to be displayed in the top bar.
 * @param queryResult - The result of the query. **Note that if queryResult.pullToRefresh is true, the loading spinner will not be displayed.**
 */
export const useConnectivityIndicator = <Data extends Record<string, unknown>>(
  componentId: string,
  optionsTopBarRightButtons: OptionsTopBar['rightButtons'] = [],
  queryResult?: Pick<QueryResult, 'data' | 'loading'> & {
    pullToRefresh?: boolean
  },
  extraData?: Data,
) => {
  const netInfo = useNetInfo()
  const pastIsConnected = useOfflineStore(
    ({ pastIsConnected }) => pastIsConnected,
  )
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const { resetConnectionState } = useOfflineActions()

  const updateNavigationButtons = () => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: isConnected
          ? // Only show loading button if the user is connected
            [
              ...optionsTopBarRightButtons,
              queryResult?.loading && !queryResult?.pullToRefresh
                ? loadingButton
                : undefined,
            ].filter(isDefined)
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
    if (extraData) {
      // Make sure update the navigation buttons if extraData is passed
      updateNavigationButtons()
    }
  }, [extraData])

  useEffect(() => {
    if (queryResult?.data) {
      updateNavigationButtons()
    }
  }, [queryResult])
}
