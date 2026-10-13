import { Stack } from 'expo-router'
import { useIntl } from 'react-intl'
import { Platform } from 'react-native'
import {
  modalScreenOptions,
  tabScreenOptions,
} from '../../../../constants/screen-options'

export default function NotificationsLayout() {
  const intl = useIntl()
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          ...tabScreenOptions,
          headerTitle: intl.formatMessage({ id: 'notifications.screenTitle' }),
          // Sheet root: dismissed with the close item, so no back chevron.
          ...(Platform.OS === 'ios' && {
            unstable_headerLeftItems: () => [],
          }),
        }}
      />
      <Stack.Screen
        name="document/[id]"
        options={{
          ...tabScreenOptions,
          title: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="message/[id]"
        options={{
          ...tabScreenOptions,
          title: intl.formatMessage({ id: 'health.messages.screenTitle' }),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name="message/new" options={modalScreenOptions} />
    </Stack>
  )
}
