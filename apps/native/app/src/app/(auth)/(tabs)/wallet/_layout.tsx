import { Stack } from 'expo-router'
import { Platform } from 'react-native'
import { useTheme } from 'styled-components'

export default function WalletLayout() {
  const theme = useTheme()
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerTransparent: Platform.OS === 'ios',
        headerStyle:
          Platform.OS === 'android'
            ? { backgroundColor: theme.color.white }
            : undefined,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Skírteini',
        }}
      />
      <Stack.Screen name="[licenseType]/[id]" />
      <Stack.Screen
        name="scanner/index"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="scanner/[id]" />
    </Stack>
  )
}
