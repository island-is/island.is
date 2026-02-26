import { Stack } from 'expo-router'
import { tabScreenOptions } from '../../../../constants/screen-options'
import { useIntl } from 'react-intl'

export default function InboxLayout() {
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
          title: intl.formatMessage({ id: 'inbox.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="filter"
        options={{
          title: intl.formatMessage({ id: 'inboxFilters.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          title: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="[id]/communications"
        options={{
          headerShown: false,
        }}
      />
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
