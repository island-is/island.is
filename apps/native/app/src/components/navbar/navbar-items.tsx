import { View } from 'react-native'
import { OfflineIcon } from '../offline/offline-icon'
import { router } from 'expo-router'
import { NativeStackHeaderItem } from '@react-navigation/native-stack'

export function navbarOfflineItem(): NativeStackHeaderItem {
  return {
    type: 'custom',
    element: (
      <View style={{ paddingLeft: 92 }}>
        <OfflineIcon />
      </View>
    ),
    hidesSharedBackground: true,
  }
}

export function navbarCloseItem(): NativeStackHeaderItem {
  return {
    type: 'button',
    label: 'Close',
    icon: { type: 'sfSymbol', name: 'xmark' },
    onPress: () => router.back(),
  }
}

export function navbarAndroidOfflineItem() {
  return (<OfflineIcon />);
}
