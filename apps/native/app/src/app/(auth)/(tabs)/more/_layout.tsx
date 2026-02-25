import { Stack, useRouter } from 'expo-router'
import { Button, Icon } from '../../../../ui'
import { Platform, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components'
import { tabScreenOptions } from '../../../../constants/screen-options'
import { useIntl } from 'react-intl'

export default function MoreLayout() {
  const intl = useIntl()
  const router = useRouter()
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
          title: intl.formatMessage({ id: 'profile.screenTitle' }),
          headerRight:
            Platform.OS === 'android'
              ? () => (
                  <TouchableOpacity
                    onPress={() => {
                      router.navigate('/settings')
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
      <Stack.Screen
        name="family/index"
        options={{ title: intl.formatMessage({ id: 'family.screenTitle' }) }}
      />
      <Stack.Screen
        name="family/[type]/[nationalId]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="assets/index"
        options={{
          title: intl.formatMessage({ id: 'assetsOvervies.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="assets/[id]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="vehicles/index"
        options={{ title: intl.formatMessage({ id: 'vehicles.screenTitle' }) }}
      />
      <Stack.Screen name="vehicles/[id]" />
      <Stack.Screen
        name="vehicles/mileage/[id]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="finance/index"
        options={{ title: intl.formatMessage({ id: 'finance.screenTitle' }) }}
      />
      <Stack.Screen
        name="finance/status/[orgId]/[chargeTypeId]"
        options={{
          presentation: 'formSheet',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="applications/index"
        options={{
          title: intl.formatMessage({ id: 'applications.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="applications/incomplete"
        options={{
          title: intl.formatMessage({ id: 'applications.incomplete' }),
        }}
      />
      <Stack.Screen
        name="applications/in-progress"
        options={{
          title: intl.formatMessage({ id: 'applications.inProgress' }),
        }}
      />
      <Stack.Screen
        name="applications/completed"
        options={{
          title: intl.formatMessage({ id: 'applications.completed' }),
        }}
      />
      <Stack.Screen
        name="air-discount"
        options={{
          title: intl.formatMessage({ id: 'airDiscount.screenTitle' }),
        }}
      />
    </Stack>
  )
}
