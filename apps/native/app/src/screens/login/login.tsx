import { Button, Heading } from '@island.is/island-ui-native'
import React from 'react'
import { SafeAreaView, Image, View } from 'react-native'
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation'
import logo from '../../assets/logo/logo-64w.png'
import { useAuthStore } from '../../stores/auth-store'
import { getAppRoot, getMainRoot } from '../../utils/lifecycle/get-app-root'
import { testIDs } from '../../utils/test-ids'

export const LoginScreen: NavigationFunctionComponent = () => {
  const authStore = useAuthStore()
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100
      }}
      testID={testIDs.SCREEN_LOGIN}
    >
      <Image
        source={logo}
        resizeMode="contain"
        style={{ width: 64, height: 64, marginBottom: 20 }}
      />
      <View style={{ maxWidth: 300 }}>
        <Heading isCenterAligned>
          Velkomin í Stafrænt Ísland
        </Heading>
      </View>
      <Button
        title="Auðkenna"
        testID={testIDs.LOGIN_BUTTON_AUTHENTICATE}
        onPress={async () => {
          try {
            const isAuth = await authStore.login();
            if (isAuth) {
              const userInfo = await authStore.fetchUserInfo()
              if (userInfo) {
                Navigation.setRoot({ root: getMainRoot() })
              }
            }
          } catch (err) {
            // noop
            console.error('err', err);
          }
        }}
      />
    </SafeAreaView>
  )
}

LoginScreen.options = {
  topBar: {
    title: {
      text: 'Login',
    },
  },
}
