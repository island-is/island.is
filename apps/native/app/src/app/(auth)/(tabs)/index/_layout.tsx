import { Stack } from 'expo-router'
import { modalScreenOptions, tabScreenOptions } from '../../../../constants/screen-options'
import { useIntl } from 'react-intl'

export default function IndexLayout() {
  const intl = useIntl()
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        ...tabScreenOptions
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
