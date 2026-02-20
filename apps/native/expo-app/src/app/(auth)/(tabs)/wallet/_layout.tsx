import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme } from 'styled-components';

export default function WalletLayout() {
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
          title: 'Skírteini',
        }}
      />
      <Stack.Screen
        name="[licenseType]/[id]"
        options={{
          headerTransparent: Platform.OS === 'ios',
          headerStyle: {
            backgroundColor: theme.shade.background,
          },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  )
}
