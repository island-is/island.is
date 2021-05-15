import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { testIDs } from '../../utils/test-ids'

interface PinKeypadProps {
  onInput?(value: string): void
  onInputIn?(value: string): void
  onInputOut?(value: string): void
  onFaceIdPress?(value: string): void
  onBackPress?(value: string): void
  faceId?: boolean
  back?: boolean
}

interface NumButtonProps {
  value: string
  testID: string
  accessibilityLabel?: string
  icon?: any
  onPress?(value: string): void
  onPressIn?(value: string): void
  onPressOut?(value: string): void
}

const NumButtonTouchable = styled.TouchableHighlight`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.color.blue100};
  margin: 16px;
`

const NumButtonText = styled.Text<{ color: string }>`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 32px;
  line-height: 38px;
  color: ${(props) => props.color};
`

const Gap = styled.View`
  width: 64px;
  height: 64px;
  margin: 16px;
`

function NumButton({
  value,
  icon,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityLabel,
  testID,
}: NumButtonProps) {
  const theme = useTheme()
  const [pressed, setPressed] = useState(false)
  useEffect(() => {
    if (pressed && onPressIn) {
      onPressIn(value)
    }
    if (!pressed && onPressOut) {
      onPressOut(value)
    }
  }, [pressed])

  const tintColor = pressed ? theme.color.white : theme.color.blue400

  return (
    <NumButtonTouchable
      underlayColor={theme.color.blue400}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => onPress && onPress(value)}
      accessibilityLabel={accessibilityLabel || value}
    >
      {icon ? (
        <Image source={icon} style={{ tintColor }} />
      ) : (
        <NumButtonText color={tintColor}>{value}</NumButtonText>
      )}
    </NumButtonTouchable>
  )
}

const Row = styled.View`
  flex-direction: row;
`

export function PinKeypad({
  faceId,
  back,
  onInput,
  onInputIn,
  onInputOut,
  onFaceIdPress,
  onBackPress,
}: PinKeypadProps) {
  return (
    <View>
      <Row>
        <NumButton
          value="1"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_1}
        />
        <NumButton
          value="2"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_2}
        />
        <NumButton
          value="3"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_3}
        />
      </Row>
      <Row>
        <NumButton
          value="4"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_4}
        />
        <NumButton
          value="5"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_5}
        />
        <NumButton
          value="6"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_6}
        />
      </Row>
      <Row>
        <NumButton
          value="7"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_7}
        />
        <NumButton
          value="8"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_8}
        />
        <NumButton
          value="9"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_9}
        />
      </Row>
      <Row>
        {faceId ? (
          <NumButton
            value="face_id"
            onPress={onFaceIdPress}
            icon={require('../../assets/icons/face-id.png')}
            accessibilityLabel="Use FaceID"
            testID={testIDs.PIN_KEYPAD_BUTTON_FACEID}
          />
        ) : (
          <Gap />
        )}
        <NumButton
          value="0"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_0}
        />
        {back ? (
          <NumButton
            value="delete"
            onPress={onBackPress}
            icon={require('../../assets/icons/keyboard-delete.png')}
            accessibilityLabel="Delete character"
            testID={testIDs.PIN_KEYPAD_BUTTON_DELETE}
          />
        ) : (
          <Gap />
        )}
      </Row>
    </View>
  )
}
