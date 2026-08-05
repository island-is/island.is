import { Stack } from 'expo-router'

import { tabScreenOptions } from '../../../../constants/screen-options'

export const unstable_settings = {
  initialRouteName: 'index',
}

export default function WalletLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        ...tabScreenOptions,
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
