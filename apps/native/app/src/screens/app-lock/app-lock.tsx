import { dynamicColor, font } from '@ui'
import { selectionAsync } from 'expo-haptics'
import {
  AuthenticationType,
  authenticateAsync,
} from 'expo-local-authentication'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Animated, Image, SafeAreaView, View } from 'react-native'
import Keychain from 'react-native-keychain'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import {
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'
import logo from '../../assets/logo/logo-64w.png'
import { PinKeypad } from '../../components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '../../components/visualized-pin-code/visualized-pin-code'
import { authStore } from '../../stores/auth-store'
import {
  preferencesStore,
  usePreferencesStore,
} from '../../stores/preferences-store'
import { uiStore, useUiStore } from '../../stores/ui-store'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'
import { testIDs } from '../../utils/test-ids'

const MAX_PIN_CHARS = 4
const MAX_ATTEMPTS = 3

const Host = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${dynamicColor('background')};
`

const Title = styled.Text`
  ${font({
    fontSize: 20,
  })}
  margin-bottom: 8px;
`

const Subtitle = styled.Text`
  ${font({
    fontSize: 20,
  })}
  height: 22px;
`

const Center = styled.View`
  justify-content: center;
  align-items: center;
`

function useBiometricType() {
  const { authenticationTypes } = useUiStore()
  if (authenticationTypes.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    return 'faceid'
  } else if (authenticationTypes.includes(AuthenticationType.FINGERPRINT)) {
    return 'fingerprint'
  } else if (authenticationTypes.includes(AuthenticationType.IRIS)) {
    return 'iris'
  }
  return undefined
}

export const AppLockScreen: NavigationFunctionComponent<{
  lockScreenActivatedAt?: number
  status: string
}> = ({ componentId, lockScreenActivatedAt, status }) => {
  const av = useRef(new Animated.Value(1)).current
  const isPromptRef = useRef(false)
  const [code, setCode] = useState('')
  const [invalidCode, setInvalidCode] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const { useBiometrics } = usePreferencesStore()
  const biometricType = useBiometricType()
  const intl = useIntl()

  const resetLockScreen = useCallback(() => {
    authStore.setState(() => ({
      lockScreenActivatedAt: undefined,
      lockScreenComponentId: undefined,
    }))
  }, [])

  const unlockApp = useCallback(() => {
    Animated.spring(av, {
      toValue: 0,
      useNativeDriver: true,
      delay: 100,
    }).start(() => {
      resetLockScreen()
      Navigation.dismissAllOverlays()
      av.setValue(1)
    })
  }, [componentId])

  const authenticateWithBiometrics = useCallback(async () => {
    if (!useBiometrics) {
      // dont have biometrics
      return
    }
    if (isPromptRef.current) {
      // dont show twice?
      return
    }
    isPromptRef.current = true
    const response = await authenticateAsync()
    if (response.success === true) {
      selectionAsync()
      unlockApp()
    }
  }, [isPromptRef])

  useEffect(() => {
    if (status === 'active' && isPromptRef.current) {
      isPromptRef.current = false
    } else if (status === 'active') {
      authenticateWithBiometrics()
    }
  }, [status])

  useNavigationComponentDidAppear(() => {
    authStore.setState(() => ({
      lockScreenActivatedAt: lockScreenActivatedAt ?? Date.now(),
      lockScreenComponentId: componentId,
    }))
    uiStore.setState({ initializedApp: true })
  })

  useNavigationComponentDidDisappear(() => {
    resetLockScreen()
  })

  useEffect(() => {
    setInvalidCode(false)
    if (code.length === MAX_PIN_CHARS) {
      if (attempts === MAX_ATTEMPTS) {
        // maximum attempts reached
        authStore
          .getState()
          .logout()
          .then(() => {
            preferencesStore.setState({ hasOnboardedPinCode: false })
            // you are now logged out and navigated to root screen
            resetLockScreen()
            Navigation.dismissAllOverlays()
            Navigation.dismissAllModals()
            getAppRoot().then((root) => Navigation.setRoot({ root }))
          })
      } else {
        // matching pin code
        Keychain.getGenericPassword({ service: 'PIN_CODE' })
          .then((res) => {
            if (res && res.password === code) {
              unlockApp()
            } else {
              // increment attemps, reset code and display warning
              setAttempts((previousAttempts) => previousAttempts + 1)
              setInvalidCode(true)
              setTimeout(() => {
                setCode('')
              }, 660)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }, [code])

  const onPinInput = (char: string) => {
    setCode(
      (previousCode) =>
        `${previousCode}${previousCode.length >= MAX_PIN_CHARS ? '' : char}`,
    )
  }

  const onBackPress = () => {
    setCode(
      (previousCode) => `${previousCode.substr(0, previousCode.length - 1)}`,
    )
  }

  const onFaceIdPress = () => {
    // we know the prompt is not present at this time
    isPromptRef.current = false
    authenticateWithBiometrics()
  }

  return (
    <Host testID={testIDs.SCREEN_APP_LOCK} style={{ opacity: av }}>
      <SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 20,
            maxHeight: 200,
            flex: 1,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45, marginBottom: 20 }}
          />
          <Title>{intl.formatMessage({ id: 'applock.title' })}</Title>
          <Subtitle>
            {attempts > 0
              ? `${MAX_ATTEMPTS - attempts} ${intl.formatMessage({
                  id: 'applock.attempts',
                })}`
              : ''}
          </Subtitle>
        </View>
        <Center>
          <VisualizedPinCode
            code={code}
            invalid={invalidCode}
            maxChars={MAX_PIN_CHARS}
          />
          <View style={{ height: 32 }} />
          <PinKeypad
            onInput={onPinInput}
            onBackPress={onBackPress}
            onFaceIdPress={onFaceIdPress}
            back={code.length > 0}
            biometricType={
              useBiometrics ? biometricType ?? 'faceid' : undefined
            }
          />
          <View style={{ height: 64 }} />
        </Center>
      </SafeAreaView>
    </Host>
  )
}

AppLockScreen.options = {
  topBar: {
    visible: false,
  },
  layout: {
    backgroundColor: 'transparent',
    componentBackgroundColor: 'transparent',
    orientation: ['portrait'],
  },
}
