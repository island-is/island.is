import {
  Image,
  Platform,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native'

import { NetworkStatus } from '@apollo/client'
import { useNetInfo } from '@react-native-community/netinfo'
import { useCallback, useEffect, useRef, useState } from 'react'
import cloudOfflineIcon from '../../assets/icons/cloud-offline-outline.png'
import { LoadingIcon } from '../nav-loading-spinner/loading-icon'
import { Pressable } from '../pressable/pressable'
import { offlineStore } from '../../stores/offline-store'

export const OfflineIcon = ({
  networkStatus,
}: {
  networkStatus?: NetworkStatus | NetworkStatus[]
}) => {
  const debug = false // __DEV__;

  const netInfo = useNetInfo()

  const networkStatuses = (
    Array.isArray(networkStatus) ? networkStatus : [networkStatus]
  ).filter(Boolean) as NetworkStatus[]

  const loading = networkStatuses.some(
    (status) => status === NetworkStatus.loading,
  )

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const loadingStartRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(loading)
  const [showDebugMenu, setShowDebugMenu] = useState(false)

  const isFetching = networkStatuses.some(
    (s) => s === NetworkStatus.loading || s === NetworkStatus.refetch,
  )

  const onOfflinePress = useCallback(() => {
    // Show the offline modal
    offlineStore.setState({ bannerVisible: true })
    void 0
  }, [])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (loading && !isLoading) {
      loadingStartRef.current = Date.now()
      setIsLoading(true)
    } else if (isLoading && !loading) {
      const elapsed = Date.now() - (loadingStartRef.current ?? 0)
      const remaining = Math.max(0, 660 - elapsed)
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        loadingStartRef.current = null
      }, remaining)
    }
  }, [loading, isLoading])

  if (debug) {
    return (
      <>
        <TouchableNativeFeedback onPress={() => setShowDebugMenu((v) => !v)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                // monospace
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                marginRight: 4,
              }}
            >
              {networkStatuses.filter((v) => v === NetworkStatus.ready).length}/
              {networkStatuses.length}
            </Text>
            {!netInfo.isConnected || !netInfo.isInternetReachable ? (
              <Image
                style={{ width: 24, height: 24 }}
                source={cloudOfflineIcon}
              />
            ) : isFetching || isLoading ? (
              <LoadingIcon />
            ) : null}
          </View>
        </TouchableNativeFeedback>
        {showDebugMenu ? (
          <View
            style={{
              position: 'absolute',
              top: 40,
              right: 0,
              padding: 16,
              minWidth: 200,
              borderRadius: 12,
              boxShadow: '0 2px 18px rgba(0,0,0,0.15)',
              backgroundColor: 'white',
            }}
          >
            <Text
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              }}
            >
              {!netInfo.isInternetReachable ? '⚠️ No Internet\n' : ''}
              {netInfo.type},{' '}
              {netInfo.isConnected ? 'connected' : 'disconnected'}
              {'\n'}
              {JSON.stringify(netInfo.details, null, 2)}
              {'\n'}
              Loading:{' '}
              {
                networkStatuses.filter((x) => x === NetworkStatus.loading)
                  .length
              }
              {'\n'}
              Fetch More:{' '}
              {
                networkStatuses.filter((x) => x === NetworkStatus.fetchMore)
                  .length
              }
              {'\n'}
              Refetch:{' '}
              {
                networkStatuses.filter((x) => x === NetworkStatus.refetch)
                  .length
              }
              {'\n'}
              Poll:{' '}
              {networkStatuses.filter((x) => x === NetworkStatus.poll).length}
              {'\n'}
              Ready:{' '}
              {networkStatuses.filter((x) => x === NetworkStatus.ready).length}
              {'\n'}
              Error:{' '}
              {networkStatuses.filter((x) => x === NetworkStatus.error).length}
              {'\n'}
            </Text>
          </View>
        ) : null}
      </>
    )
  }

  if (isLoading) {
    return <LoadingIcon />
  }

  if (!netInfo.isConnected || !netInfo.isInternetReachable) {
    return (
      <Pressable onPress={onOfflinePress}>
        <Image style={{ width: 24, height: 24 }} source={cloudOfflineIcon} />
      </Pressable>
    )
  }

  return null
}
