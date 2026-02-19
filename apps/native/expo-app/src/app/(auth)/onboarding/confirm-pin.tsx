import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, SafeAreaView, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Keychain from 'react-native-keychain'
import styled from 'styled-components/native'

import { dynamicColor, font } from '@/ui'
import { CancelButton } from '@/ui/lib/button/cancel-button'
import { PinKeypad } from '@/components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '@/components/visualized-pin-code/visualized-pin-code'
import { preferencesStore } from '@/stores/preferences-store'
import { nextOnboardingStep } from '@/utils/onboarding'

const logo = require('@/assets/logo/logo-64w.png')

const MAX_PIN_CHARS = 4

const Host = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${dynamicColor('background')};
`

const Title = styled.Text`
  ${font({ fontSize: 20 })}
  margin-bottom: 10px;
  max-width: 75%;
  min-width: 360px;
  text-align: center;
`

const Subtitle = styled.Text`
  ${font({ fontSize: 14 })}
  min-height: 20px;
  max-width: 75%;
  text-align: center;
`

const Center = styled.View`
  justify-content: center;
  align-items: center;
`

export default function ConfirmPinScreen() {
  const intl = useIntl()
  const { confirmPin } = useLocalSearchParams<{ confirmPin: string }>()
  const [code, setCode] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onPinInput = (char: string) => {
    setCode((prev) => `${prev}${prev.length >= MAX_PIN_CHARS ? '' : char}`)
  }

  const onBackPress = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  const onCancelPress = () => {
    router.back()
  }

  useEffect(() => {
    if (code.length === MAX_PIN_CHARS) {
      if (code === confirmPin) {
        Keychain.setGenericPassword('PIN_CODE', code, {
          service: 'PIN_CODE',
        }).then(() => {
          preferencesStore.setState({ hasOnboardedPinCode: true })
          nextOnboardingStep()
        })
      } else {
        setInvalid(true)
        setErrorMessage(
          intl.formatMessage({ id: 'onboarding.pinCode.nonMatchingPinCodes' }),
        )
        setTimeout(() => {
          setInvalid(false)
          setCode('')
        }, 660)
      }
    } else if (code.length >= 1) {
      setErrorMessage('')
    }
  }, [code])

  return (
    <Host>
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
            style={{ width: 45, height: 45, marginBottom: 16 }}
          />
          <Title>
            <FormattedMessage id="onboarding.pinCode.confirmPin" />
          </Title>
          <Subtitle>{errorMessage}</Subtitle>
        </View>
        <Center>
          <VisualizedPinCode
            code={code}
            invalid={invalid}
            maxChars={MAX_PIN_CHARS}
            style={{ marginBottom: 20 }}
          />
          <PinKeypad
            onInput={onPinInput}
            onBackPress={onBackPress}
            back={code.length > 0}
          />
          <View
            style={{
              height: 64,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <CancelButton
              title={<FormattedMessage id="onboarding.pinCode.goBackButtonText" />}
              arrowBack={true}
              onPress={onCancelPress}
            />
          </View>
        </Center>
      </SafeAreaView>
    </Host>
  )
}
