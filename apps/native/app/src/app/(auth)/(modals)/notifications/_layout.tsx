import { Stack } from 'expo-router'
import { useIntl } from 'react-intl'
import { tabScreenOptions } from '../../../../constants/screen-options'

export default function NotificationsLayout() {
  const intl = useIntl()
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          ...tabScreenOptions,
          headerTitle: intl.formatMessage({ id: 'notifications.screenTitle' }),
        }}
      />
      <Stack.Screen
        name="document/[id]"
        options={{
          ...tabScreenOptions,
          title: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
        }}
      />
    </Stack>
  )
}
