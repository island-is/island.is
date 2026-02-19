import { Stack } from 'expo-router'

export default function MoreLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTransparent: true,
          title: 'Meira',
          headerLargeTitleEnabled: false,
        }}
      />
    </Stack>
  )
}
