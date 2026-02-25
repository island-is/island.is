import { StackScreenProps } from 'expo-router'
import { Platform } from 'react-native'
import {
  navbarCloseItem,
  navbarAndroidOfflineItem,
  navbarOfflineItem,
} from '../components/navbar/navbar-items'
import { theme } from '../ui'

export const tabScreenOptions: StackScreenProps['options'] = {
  headerShown: true,
  headerTransparent: Platform.OS === 'ios',
  headerStyle:
    Platform.OS === 'android'
      ? { backgroundColor: theme.color.white }
      : undefined,
  headerShadowVisible: false,
}

export const modalScreenOptions: StackScreenProps['options'] = {
  headerShown: true,
  headerTransparent: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: theme.color.white,
  },
  headerTitleAlign: 'left',
  headerTitleStyle: {
    fontFamily: 'IBMPlexSans_600SemiBold',
    fontSize: 20,
  },
  sheetGrabberVisible: true,
  sheetCornerRadius: 16,
  presentation: Platform.OS === 'android' ? 'modal' : 'formSheet',
  unstable_headerRightItems: () => [navbarOfflineItem(), navbarCloseItem()],
  headerRight: () => navbarAndroidOfflineItem()
}
