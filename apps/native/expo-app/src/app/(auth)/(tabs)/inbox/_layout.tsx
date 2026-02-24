import { Stack } from 'expo-router'

export default function InboxLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTransparent: true,
          title: 'Pósthólf',
        }}
      />
      <Stack.Screen name="filter"
        options={{
          headerTransparent: true,
          title: 'Sía pósthólfið',
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          headerTransparent: true,
          title: 'Póstur',
        }}
      />
      <Stack.Screen name="[id]/communications" options={{ title: 'Samskipti' }} />
      <Stack.Screen
        name="[id]/reply"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
    </Stack>
  )
}
