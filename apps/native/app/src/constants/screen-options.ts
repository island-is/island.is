import { router, StackScreenProps } from 'expo-router'
import { NativeStackHeaderItem } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import { navbarCloseItem } from '../components/navbar/navbar-items'

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
          // Colour comes from the navigation theme's `primary`.
          onPress: () => router.back(),
        },
      ]
    : []

export const tabScreenOptions: StackScreenProps['options'] = {
  headerShown: true,
  headerTransparent: Platform.OS === 'ios',
  // The header background comes from the navigation theme's `card` colour so
  // it follows light/dark. Setting it here would pin it to one theme.
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  // The blue chevron back item uses an SF Symbol, which is iOS-only. On
  // Android we keep the default native back arrow (black) instead.
  ...(Platform.OS === 'ios' && {
    headerBackVisible: false,
    unstable_headerLeftItems: blueBackItem,
  }),
}

// Sheet titles use the heading5 typography variant. iOS always centres them;
// on Android they stay left-aligned.
export const sheetHeaderTitleOptions: StackScreenProps['options'] = {
  headerTitleAlign: 'left',
  headerTitleStyle: {
    fontFamily: 'IBMPlexSans_600SemiBold',
    fontSize: 16,
  },
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
  // Header and body colours come from the navigation theme (`card` and
  // `background`) so they follow light/dark.
  ...sheetHeaderTitleOptions,
  sheetGrabberVisible: true,
  sheetCornerRadius: 16,
  presentation: Platform.OS === 'android' ? 'modal' : 'formSheet',
  unstable_headerRightItems: () => [navbarCloseItem()],
}
