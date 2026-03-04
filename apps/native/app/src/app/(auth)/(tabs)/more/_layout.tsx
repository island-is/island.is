import { Stack, useRouter } from 'expo-router'
import { Button, Icon } from '../../../../ui'
import { Platform, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components'
import {
  modalScreenOptions,
  tabScreenOptions,
} from '../../../../constants/screen-options'
import { useIntl } from 'react-intl'
import { navbarOfflineItem } from '../../../../components/navbar/navbar-items'
import { StackScreen } from '../../../../components/stack-screen'

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
        options={{
          title: intl.formatMessage({ id: 'vehicles.screenTitle' }),
        }}
      />
      <Stack.Screen name="vehicles/[id]/index" />
      <Stack.Screen
        name="vehicles/[id]/mileage"
        options={{
          ...modalScreenOptions,
          title: intl.formatMessage({ id: 'vehicles.registerMileage' }),
        }}
      />
      <Stack.Screen
        name="finance/index"
        options={{ title: intl.formatMessage({ id: 'finance.screenTitle' }) }}
      />
      <Stack.Screen
        name="finance/status/[orgId]/[chargeTypeId]"
        options={{
          ...modalScreenOptions,
        }}
      />
      <Stack.Screen
        name="applications/index"
        options={{
          title: intl.formatMessage({ id: 'applications.title' }),
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
