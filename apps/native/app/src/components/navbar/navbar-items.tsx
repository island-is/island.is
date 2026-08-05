import { Platform, View } from 'react-native'
import { OfflineIcon } from '../offline/offline-icon'
import { router } from 'expo-router'
import { NativeStackHeaderItem } from '@react-navigation/native-stack'
import { NetworkStatus } from '@apollo/client'
import { theme } from '../../ui'

export function navbarOfflineItem(
  networkStatus?: NetworkStatus | NetworkStatus[],
): NativeStackHeaderItem {
  return {
    type: 'custom',
    element: <OfflineIcon networkStatus={networkStatus} />,
    hidesSharedBackground: true,
  }
}

export function navbarCloseItem(): NativeStackHeaderItem {
  return {
    type: 'button',
    label: 'Close',
    icon: { type: 'sfSymbol', name: 'xmark' },
    tintColor: theme.color.blue400,
    onPress: () => router.back(),
  }
}

export function spacingItem(): NativeStackHeaderItem {
  return {
    type: 'custom',
    element: <View style={{ width: 128 }} />,
    hidesSharedBackground: true,
  }
}

export function navbarAndroidOfflineItem() {
  return <OfflineIcon />
}
