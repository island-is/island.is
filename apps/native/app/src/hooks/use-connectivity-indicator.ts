import { QueryResult } from '@apollo/client'
import { useNetInfo } from '@react-native-community/netinfo'
import isEqual from 'lodash/isEqual'

import { theme } from '@ui'
import { useCallback, useEffect, useRef } from 'react'
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
  icon: require('../assets/icons/cloud-offline-outline.png'),
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

type PickedQueryResult = Pick<QueryResult, 'loading' | 'data'>

type UseConnectivityIndicatorProps<Data> = {
  componentId: string
  rightButtons?: OptionsTopBar['rightButtons']
  queryResult?: PickedQueryResult | PickedQueryResult[]
  refetching?: boolean
  extraData?: Data
}

/**
 * `useConnectivityIndicator` is a hook designed to enhance app navigation by dynamically displaying connectivity-related UI elements.
 * It manages the visual indication of the app’s network status by showing a loading spinner when data is being fetched and an offline icon when no internet connection is available.
 * This hook helps improve user experience by providing real-time feedback on the app's connectivity state.
 *
 * @param componentId - The unique ID of the component.
 * @param rightButtons - The right buttons to be displayed in the top bar.
 * @param queryResult - The result of the query. **Note that if queryResult.pullToRefresh is true, the loading spinner will not be displayed.**
 * @param refetching - A boolean value indicating whether the app is currently refetching data.
 * @param extraData - Additional data to trigger navigation update
 */
export const useConnectivityIndicator = <Data extends Record<string, unknown>>({
  componentId,
  rightButtons = [],
  queryResult,
  refetching = false,
  extraData,
}: UseConnectivityIndicatorProps<Data>) => {
  const netInfo = useNetInfo()
  const pastIsConnected = useOfflineStore(
    ({ pastIsConnected }) => pastIsConnected,
  )
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const { resetConnectionState } = useOfflineActions()
  const prevQueryResultRef = useRef<PickedQueryResult | PickedQueryResult[]>()

  const updateNavigationButtons = useCallback(
    (showLoading = false) => {
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons: isConnected
            ? [...rightButtons, showLoading ? loadingButton : undefined].filter(
                isDefined,
              )
            : rightButtons
            ? [...rightButtons, offlineButton]
            : [offlineButton],
        },
      })
    },
    [componentId, isConnected, rightButtons],
  )

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
    // We need to deep compare the query result to avoid unnecessary re-renders
    if (queryResult && !isEqual(prevQueryResultRef.current, queryResult)) {
      prevQueryResultRef.current = queryResult

      if (Array.isArray(queryResult)) {
        // Make sure all queries are loaded and have data before removing the loading button
        if (queryResult.every(({ loading, data }) => !loading && data)) {
          updateNavigationButtons(false)
        } else if (queryResult.every(({ data }) => data)) {
          updateNavigationButtons(!refetching)
        }
      } else if (queryResult?.data) {
        updateNavigationButtons(queryResult?.loading && !refetching)
      }
    }
  }, [queryResult])
}
