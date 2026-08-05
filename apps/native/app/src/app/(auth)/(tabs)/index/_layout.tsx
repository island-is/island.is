import { Stack } from 'expo-router'
import { Platform } from 'react-native'
import { useIntl } from 'react-intl'
import { tabScreenOptions } from '../../../../constants/screen-options'
import { useNotificationsStore } from '../../../../stores/notifications-store'
import { theme } from '../../../../ui'

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
          headerStyle:
            Platform.OS === 'android'
              ? { backgroundColor: theme.color.blue100 }
              : undefined,
        }}
      />
    </Stack>
  )
}
