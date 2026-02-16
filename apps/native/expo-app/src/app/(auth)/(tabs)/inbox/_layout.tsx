import { Stack } from 'expo-router'

import { NativeTabsProps } from 'expo-router/unstable-native-tabs'

export default function InboxLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{
        headerTransparent: true,
        title: 'Pósthólf',
      }} />
      <Stack.Screen name="filter" />
      <Stack.Screen name="[id]" options={{
        headerTransparent: true,
        title: 'Póstur',
      }} />
    </Stack>
  )
}
