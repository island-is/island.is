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
        <Heading isCenterAligned>Um þig</Heading>
        <Text style={{ marginBottom: 10 }}>
          Kennitala: {authStore.userInfo?.nationalId}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          Land: {authStore.userInfo?.nat}
        </Text>
        <Text>
          Authorization Expires:{' '}
          {authStore.authorizeResult?.accessTokenExpirationDate}
        </Text>
        <View style={{ height: 50 }} />
        <Heading isCenterAligned>Aðgerðir</Heading>
        <Button
          title="Dæmi um notification - kemur eftir 5 sekúndur"
          onPress={() => {
            scheduleNotificationAsync({
              content: {
                title: "Þjóðskrá Íslands",
                body: 'Tilkynning um fasteignamat er tekur gildi 31. desember 2020',
              },
              trigger: { seconds: 5 },
            })
          }}
        />
        <Button
          testID={testIDs.LOGOUT_BUTTON}
          title="Útskrá mig"
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
