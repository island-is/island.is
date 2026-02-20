import { Stack, useRouter } from 'expo-router'
import { Button, Icon } from '../../../../ui'
import { Platform, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components';

export default function MoreLayout() {
  const router = useRouter()
  const theme = useTheme();
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTransparent: Platform.OS === 'ios',
          headerStyle: {
            backgroundColor: theme.shade.background,
          },
          headerShadowVisible: false,
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
    </Stack>
  )
}
