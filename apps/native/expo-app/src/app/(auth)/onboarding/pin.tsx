import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Image, SafeAreaView, View } from 'react-native'
import { router } from 'expo-router'
import styled from 'styled-components/native'

import { dynamicColor, font } from '@/ui'
import { PinKeypad } from '@/components/pin-keypad/pin-keypad'
import { VisualizedPinCode } from '@/components/visualized-pin-code/visualized-pin-code'

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

export default function PinScreen() {
  const [code, setCode] = useState('')

  const onPinInput = (char: string) => {
    setCode((prev) => `${prev}${prev.length >= MAX_PIN_CHARS ? '' : char}`)
  }

  const onBackPress = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  useEffect(() => {
    if (code.length === MAX_PIN_CHARS) {
      setTimeout(() => {
        setCode('')
        router.navigate({
          pathname: '/onboarding/confirm-pin',
          params: { confirmPin: code },
        })
      }, 110)
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
            <FormattedMessage id="onboarding.pinCode.enterPin" />
          </Title>
          <Subtitle />
        </View>
        <Center>
          <VisualizedPinCode
            code={code}
            invalid={false}
            maxChars={MAX_PIN_CHARS}
            style={{ marginBottom: 20 }}
          />
          <PinKeypad
            onInput={onPinInput}
            onBackPress={onBackPress}
            back={code.length > 0}
          />
          <View style={{ height: 64 }} />
        </Center>
      </SafeAreaView>
    </Host>
  )
}
