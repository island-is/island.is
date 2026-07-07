import { router, StackScreenProps } from 'expo-router'
import { NativeStackHeaderItem } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import { navbarCloseItem, spacingItem } from '../components/navbar/navbar-items'
import { theme } from '../ui'

export const blueBackItem = ({
  canGoBack,
}: {
  canGoBack?: boolean
}): NativeStackHeaderItem[] =>
  canGoBack
    ? [
        {
          type: 'button',
          label: '',
          icon: { type: 'sfSymbol', name: 'chevron.backward' },
          tintColor: theme.color.blue400,
          onPress: () => router.back(),
        },
      ]
    : []

export const tabScreenOptions: StackScreenProps['options'] = {
  headerShown: true,
  headerTransparent: Platform.OS === 'ios',
  headerStyle:
    Platform.OS === 'android'
      ? { backgroundColor: theme.color.white }
      : undefined,
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  headerBackVisible: false,
  unstable_headerLeftItems: blueBackItem,
}

export const modalScreenOptions: StackScreenProps['options'] = {
  headerShown: true,
  headerTransparent: false,
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
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
  unstable_headerRightItems: () => [spacingItem(), navbarCloseItem()],
}
