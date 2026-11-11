import { Redirect, Stack } from 'expo-router'
import React from 'react'

import { modalScreenOptions } from '@/constants/screen-options'

// Previews of screens whose logic hasn't landed yet. Development builds only;
// open with <scheme>://dev/device-bound-auth.
export default function DevLayout() {
  if (!__DEV__) {
    return <Redirect href="/index" />
  }

  return (
    <Stack>
      <Stack.Screen
        name="device-bound-auth/index"
        options={{ title: 'Device-bound auth' }}
      />
      <Stack.Screen
        name="device-bound-auth/preview"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen
        name="device-bound-auth/login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="device-bound-auth/electronic-id"
        options={{ ...modalScreenOptions, headerTitle: '' }}
      />
    </Stack>
  )
}
