import { Stack, useRouter } from 'expo-router'
import { Button, Icon } from '../../../../ui'
import { Platform, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components'

export default function MoreLayout() {
  const router = useRouter()
  const theme = useTheme()
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Meira',
          headerLargeTitleEnabled: false,
          headerRight:
            Platform.OS === 'android'
              ? () => (
                  <TouchableOpacity
                    onPress={() => {
                      router.push('/settings')
                    }}
                  >
                    <Icon
                      source={require('@/assets/icons/settings.png')}
                      width={24}
                      height={24}
                    />
                  </TouchableOpacity>
                )
              : undefined,
        }}
      />
      <Stack.Screen name="family/index" options={{ title: 'Fjölskyldan' }} />
      <Stack.Screen
        name="family/[type]/[nationalId]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen name="assets/index" options={{ title: 'Fasteignir' }} />
      <Stack.Screen
        name="assets/[id]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen name="vehicles/index" options={{ title: 'Ökutæki' }} />
      <Stack.Screen name="vehicles/[id]" />
      <Stack.Screen
        name="vehicles/mileage/[id]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen name="finance/index" options={{ title: 'Fjármál' }} />
      <Stack.Screen
        name="finance/status/[orgId]/[chargeTypeId]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen name="applications/index" options={{ title: 'Umsóknir' }} />
      <Stack.Screen
        name="applications/incomplete"
        options={{ title: 'Ólokið' }}
      />
      <Stack.Screen
        name="applications/in-progress"
        options={{ title: 'Í vinnslu' }}
      />
      <Stack.Screen
        name="applications/completed"
        options={{ title: 'Lokið' }}
      />
      <Stack.Screen name="air-discount" options={{ title: 'Loftbrú' }} />
    </Stack>
  )
}
