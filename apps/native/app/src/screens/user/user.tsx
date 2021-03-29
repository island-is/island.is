import { Heading } from '@island.is/island-ui-native'
import React from 'react'
import { Button, SafeAreaView, Text, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import { useScreenOptions } from '../../contexts/theme-provider'
import { scheduleNotificationAsync } from 'expo-notifications'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'

export const UserScreen: NavigationFunctionComponent = () => {
  const authStore = useAuthStore()

  useScreenOptions(
    () => ({
      topBar: {
        title: {
          text: authStore.userInfo?.name,
        },
      },
    }),
    [authStore],
  )

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 32,
      }}
      testID={testIDs.SCREEN_USER}
    >
      <View style={{ flex: 1, padding: 32 }}>
        <Heading>Stillingar etc</Heading>
        <Text style={{ marginBottom: 10 }}>
          Kennitala: {authStore.userInfo?.nationalId}
        </Text>
        <Text>
          Authorization Expires:{' '}
          {authStore.authorizeResult?.accessTokenExpirationDate}
        </Text>
        <Button
          title="Push notification"
          onPress={() => {
            scheduleNotificationAsync({
              content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
              },
              trigger: { seconds: 5 },
            })
          }}
        />
        <View style={{ flex: 1 }} />
        <Button
          title="Logout"
          onPress={async () => {
            await authStore.logout()
            await Navigation.dismissAllModals();
            Navigation.setRoot({
              root: await getAppRoot(),
            })
          }}
        />
      </View>
    </SafeAreaView>
  )
}
