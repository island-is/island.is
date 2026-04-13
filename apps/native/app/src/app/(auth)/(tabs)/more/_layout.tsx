import { Stack } from 'expo-router'
import { useIntl } from 'react-intl'
import {
  modalScreenOptions,
  tabScreenOptions,
} from '../../../../constants/screen-options'

export const unstable_settings = {
  initalRouteName: 'index',
  'vehicles/[id]/index': {
    initialRouteName: 'vehicles',
  },
  'family/[type]/[nationalId]': {
    initialRouteName: 'family',
  },
  'assets/[id]/index': {
    initialRouteName: 'assets',
  },
  'finance/status/[orgId]/[chargeTypeId]': {
    initialRouteName: 'finance',
  },
}

export default function MoreLayout() {
  const intl = useIntl()
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
          ...modalScreenOptions,
          title: intl.formatMessage({ id: 'familyDetail.title' }),
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
          ...modalScreenOptions,
          title: intl.formatMessage({ id: 'familyDetail.title' }),
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
