import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, View } from 'react-native'
import Keychain from 'react-native-keychain'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import styled from 'styled-components/native'
import logo from '../../assets/logo/logo-64w.png'
import { PinKeypad } from '../../components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '../../components/visualized-pin-code/visualized-pin-code'
import { preferencesStore } from '../../stores/preferences-store'
import { ComponentRegistry } from '../../utils/component-registry'
import { FormattedMessage, useIntl } from '../../utils/intl'
import { nextOnboardingStep } from '../../utils/onboarding'
import { testIDs } from '../../utils/test-ids'

const Host = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`

const Title = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 20px;
  color: ${(props) => props.theme.color.dark400};
  margin-bottom: 8px;
  max-width: 75%;
  text-align: center;
`

const Subtitle = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 14px;
  min-height: 20px;
  color: ${(props) => props.theme.color.dark400};
  max-width: 75%;
  text-align: center;
`

const Center = styled.View`
  justify-content: center;
  align-items: center;
`

const MAX_PIN_CHARS = 4

const CancelButton = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue400};
`

const CancelText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.color.blue400};
`

export const OnboardingPinCodeScreen: NavigationFunctionComponent<{
  confirmPin?: string
}> = ({ componentId, confirmPin }) => {
  const intl = useIntl()
  const [code, setCode] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

  const onCancelPress = () => {
    Navigation.pop(componentId)
  }

  useEffect(() => {
    if (code.length === MAX_PIN_CHARS) {
      if (confirmPin) {
        if (code === confirmPin) {
          Keychain.setGenericPassword('PIN_CODE', code, {
            service: 'PIN_CODE',
          }).then(() => {
            preferencesStore.setState(() => ({ hasOnboardedPinCode: true }))
            nextOnboardingStep()
          })
        } else {
          setInvalid(true)
          setErrorMessage(
            intl.formatMessage({
              id: 'onboarding.pinCode.nonMatchingPinCodes',
            }),
          )
          setTimeout(() => {
            setInvalid(false)
            setCode('')
          }, 660)
        }
      } else {
        setTimeout(() => {
          setCode('')
          Navigation.push(componentId, {
            component: {
              name: ComponentRegistry.OnboardingPinCodeScreen,
              passProps: {
                confirmPin: code,
              },
            },
          })
        }, 110)
      }
    } else if (code.length >= 1) {
      setErrorMessage('')
    }
  }, [code])

  return (
    <Host testID={testIDs.SCREEN_APP_LOCK}>
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
          <Title>
            {confirmPin ? (
              <FormattedMessage id="onboarding.pinCode.confirmPin" />
            ) : (
              <FormattedMessage id="onboarding.pinCode.enterPin" />
            )}
          </Title>
          <Subtitle>{errorMessage}</Subtitle>
        </View>
        <Center>
          <VisualizedPinCode
            code={code}
            invalid={invalid}
            maxChars={MAX_PIN_CHARS}
          />
          <View style={{ height: 32 }} />
          <PinKeypad
            onInput={onPinInput}
            onBackPress={onBackPress}
            back={code.length > 0}
            faceId={false}
          />
          <View
            style={{
              height: 64,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            {confirmPin && (
              <CancelButton onPress={onCancelPress}>
                <CancelText>
                  <FormattedMessage id="onboarding.pinCode.cancelButtonText" />
                </CancelText>
              </CancelButton>
            )}
          </View>
        </Center>
      </SafeAreaView>
    </Host>
  )
}

OnboardingPinCodeScreen.options = {
  popGesture: false,
  topBar: {
    visible: false,
  },
}
