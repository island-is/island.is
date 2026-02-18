import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native'
import styled from 'styled-components/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import logo from '@/assets/logo/logo-64w.png'
import { useBrowser } from '@/lib/use-browser'
import { useAuthStore } from '@/stores/auth-store'
import { preferencesStore } from '@/stores/preferences-store'
import { Button, dynamicColor, font, Illustration } from '@/ui'
import { nextOnboardingStep } from '@/utils/onboarding'
import { testIDs } from '@/utils/test-ids'
import * as WebBrowser from 'expo-web-browser'

const Host = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
`

const Title = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 26,
    color: (props) => ({ light: props.theme.color.dark400, dark: 'white' }),
  })}
  text-align: center;
  margin-top: 32px;
`

const BottomRow = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  padding: 32px;
`

const LightButtonText = styled.Text`
  ${font({
    fontWeight: '600',
    color: (props) => props.theme.color.blue400,
  })}
`

export default function LoginScreen() {
  const authStore = useAuthStore()
  const { openBrowser } = useBrowser()
  const intl = useIntl()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const onLoginPress = async () => {
    if (isLoggingIn) {
      return
    }

    setIsLoggingIn(true)
    try {
      const isAuth = await authStore.login()
      if (isAuth) {
        const userInfo = await authStore.fetchUserInfo()
        if (userInfo) {
          await nextOnboardingStep()
        }
      }
    } catch (err) {
      if ((err as Error).message.indexOf('Connection error') >= 0) {
        Alert.alert(
          intl.formatMessage({ id: 'login.networkErrorTitle' }),
          intl.formatMessage({ id: 'login.networkErrorMessage' }),
        )
      } else {
        console.warn(err)
      }
    }
    setIsLoggingIn(false)
  }

  const onLanguagePress = () => {
    const { locale, setLocale } = preferencesStore.getState()
    setLocale(locale === 'en-US' ? 'is-IS' : 'en-US')
  }

  const onNeedHelpPress = () => {
    const helpDeskUrl = 'https://island.is/flokkur/thjonusta-island-is'
    // openBrowser(helpDeskUrl)
    WebBrowser.openBrowserAsync(helpDeskUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
    })
  }

  return (
    <Host testID={testIDs.SCREEN_LOGIN}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 32,
            zIndex: 3,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 48, height: 48 }}
          />
          <View style={{ maxWidth: 300, minHeight: 170 }}>
            <Title>
              <FormattedMessage id="login.welcomeMessage" />
            </Title>
          </View>
          <Button
            title={intl.formatMessage({ id: 'login.loginButtonText' })}
            testID={testIDs.LOGIN_BUTTON_AUTHENTICATE}
            onPress={onLoginPress}
            style={{ width: 213 }}
          />
        </View>
        <BottomRow>
          <TouchableOpacity onPress={onLanguagePress}>
            <LightButtonText>
              <FormattedMessage id="login.languageButtonText" />
            </LightButtonText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNeedHelpPress}>
            <LightButtonText>
              <FormattedMessage id="login.needHelpButtonText" />
            </LightButtonText>
          </TouchableOpacity>
        </BottomRow>
      </SafeAreaView>
      <Illustration isBottomAligned />
    </Host>
  )
}

// LoginScreen.options = {
//   popGesture: false,
//   topBar: {
//     visible: false,
//   },
//   layout: {
//     orientation: ['portrait'],
//   },
// }


// import { Redirect } from 'expo-router'
// import { Button, StyleSheet, Text, View } from 'react-native'

// import { useAuthStore } from '@/stores/_mock-auth'
// import { Badge } from '@/ui/lib/badge/badge'
// import { Typography } from '../ui/lib/typography/typography'

// export default function LoginScreen() {
//   const login = useAuthStore((s) => s.login)
//   const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
//   if (isAuthenticated) {
//     return <Redirect href="/(auth)/(tabs)" />
//   }

//   return (
//     <View
//       style={[
//         styles.container,
//       ]}
//     >
//       <Typography variant="heading1">
//         Login
//       </Typography>
//       <Badge title="Hello world" variant="blue" />
//       <Text style={styles.subtitle}>Please log in to continue</Text>
//       <View style={styles.button}>
//         <Button
//           title="Log in"
//           onPress={() => {
//             login()
//           }}
//         />
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 32,
//   },
//   button: {
//     minWidth: 200,
//   },
// });
