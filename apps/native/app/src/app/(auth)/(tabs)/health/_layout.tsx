import { Stack } from 'expo-router'

export default function HealthLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Heilsa' }} />
      <Stack.Screen name="categories" options={{ title: 'Heilsuflokkar' }} />
      <Stack.Screen name="vaccinations" options={{ title: 'Bólusetningar' }} />

      <Stack.Screen name="appointments/index" options={{ title: 'Tímar' }} />
      <Stack.Screen name="appointments/[id]" options={{ title: 'Skjöl' }} />
      <Stack.Screen
        name="questionnaires/index"
        options={{ title: 'Spurningalistar' }}
      />
      <Stack.Screen
        name="questionnaires/[id]"
        options={{ title: 'Spurningalisti' }}
      />
      <Stack.Screen
        name="medicine/prescriptions/index"
        options={{ title: 'Lyfjaskírteini' }}
      />
      <Stack.Screen
        name="medicine/prescriptions/history"
        options={{ title: 'Afgreiðslusaga' }}
      />
      <Stack.Screen name="medicine/delegation/index" options={{ title: 'Lyfjaheimild' }} />
      <Stack.Screen name="medicine/delegation/add" options={{ title: 'Bæta við heimild', presentation: 'formSheet' }} />
      <Stack.Screen name="medicine/delegation/[id]" options={{ title: 'Skoða Lyfjaheimild', presentation: 'formSheet' }} />
    </Stack>
  )
}
