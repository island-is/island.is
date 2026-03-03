import { Stack } from 'expo-router'
import { useIntl } from 'react-intl'
import {
  tabScreenOptions
} from '../../../../constants/screen-options'
import { useNotificationsStore } from '../../../../stores/notifications-store'

export default function IndexLayout() {
  const intl = useIntl()
  const unseenCount = useNotificationsStore(({ unseenCount }) => unseenCount)
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
          headerTitle: intl.formatMessage({ id: 'home.screenTitle' }),
        }}
      />
    </Stack>
  )
}
