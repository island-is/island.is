import { Button, Heading } from '@island.is/island-ui-native'
import React, { useEffect } from 'react'
import { SafeAreaView, Image, View, Text } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import logo from '../../assets/logo/logo-64w.png'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import { NativeEventEmitter, NativeModules } from 'react-native';
import { useState } from 'react'
import { nextOnboardingStep } from '../../utils/onboarding'

export const LoginScreen: NavigationFunctionComponent = () => {
  const authStore = useAuthStore()

  const [authState, setAuthState] = useState<{ nonce: string; codeChallenge: string; state: string; } | null>(null);

  useEffect(() => {
    try {
      const eventEmitter = new NativeEventEmitter(NativeModules.RNAppAuth);
      const onAuthRequestInitiated = (event: any) => setAuthState(event);
      const subscription = eventEmitter.addListener('onAuthRequestInitiated', onAuthRequestInitiated);
      return () => {
        subscription.remove();
      }
    } catch (err) {
      // noop
    }
  }, []);

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
      <View style={{ position: 'absolute', opacity: 0 }}>
        <Text testID="auth_nonce">{authState?.nonce ?? 'noop1'}</Text>
        <Text testID="auth_code">{authState?.codeChallenge ?? 'noop2'}</Text>
        <Text testID="auth_state">{authState?.state ?? 'noop3'}</Text>
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
                await nextOnboardingStep();
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
  popGesture: false,
  topBar: {
    visible: false,
  },
}
