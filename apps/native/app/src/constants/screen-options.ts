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
  // The blue chevron back item uses an SF Symbol, which is iOS-only. On
  // Android we keep the default native back arrow (black) instead.
  ...(Platform.OS === 'ios' && {
    headerBackVisible: false,
    unstable_headerLeftItems: blueBackItem,
  }),
}

export const modalScreenOptions: StackScreenProps['options'] = {
  headerShown: true,
  headerTransparent: false,
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  // On iOS modals are dismissed with the close item on the right, so the
  // back button is hidden and the left slot cleared. The close item is
  // iOS-only, so Android keeps the default native back arrow instead.
  ...(Platform.OS === 'ios' && {
    headerBackVisible: false,
    unstable_headerLeftItems: () => [],
  }),
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
