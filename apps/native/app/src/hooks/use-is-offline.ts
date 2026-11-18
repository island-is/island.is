import { useNetInfo } from '@react-native-community/netinfo'

/** Whether the phone has no network. False until NetInfo knows either way. */
export function useIsOffline() {
  return useNetInfo().isConnected === false
}
