import { Stack } from 'expo-router'

export default function MoreLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTransparent: true,
          title: 'Meira',
        }}
      />
    </Stack>
  )
}
