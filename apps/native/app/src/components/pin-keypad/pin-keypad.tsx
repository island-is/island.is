import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Dimensions, useWindowDimensions } from 'react-native'
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
  size: number
  gutter: number
  onPress?(value: string): void
  onPressIn?(value: string): void
  onPressOut?(value: string): void
}

const NumButtonTouchable = styled.TouchableHighlight<{ size?: number; gutter?: number }>`
  width: ${props => props.size ?? 64}px;
  height: ${props => props.size ?? 64}px;
  border-radius: ${props => (props.size ?? 64)/2}px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.isDark ? props.theme.shade.shade300 : props.theme.color.blue100};
  margin: ${props => props.gutter ?? 16}px;
`

const NumButtonText = styled.Text<{ color: string }>`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 32px;
  line-height: 38px;
  color: ${(props) => props.color};
`

const Gap = styled.View<{ size?: number; gutter?: number }>`
  width: ${props => props.size ?? 64}px;
  height: ${props => props.size ?? 64}px;
  margin: ${props => props.gutter ?? 16}px;
`

function NumButton({
  value,
  icon,
  onPress,
  onPressIn,
  onPressOut,
  accessibilityLabel,
  testID,
  size,
  gutter,
}: NumButtonProps) {
  const { width } = Dimensions.get('window');
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

  const tintColor = pressed
    ? theme.color.white
    : theme.isDark ? theme.shade.foreground : theme.color.blue400

  return (
    <NumButtonTouchable
      underlayColor={theme.color.blue400}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => onPress && onPress(value)}
      accessibilityLabel={accessibilityLabel || value}
      testID={testID}
      size={size}
      gutter={gutter}
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

const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));

export function PinKeypad({
  faceId,
  back,
  onInput,
  onInputIn,
  onInputOut,
  onFaceIdPress,
  onBackPress,
}: PinKeypadProps) {
  const { height } = useWindowDimensions();
  const r = invlerp(512, 1024, height);
  const size = 50 + 32 * r;
  const gutter = 8 + 8 * r;
  const intl = useIntl();

  return (
    <View>
      <Row>
        <NumButton
          value="1"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_1}
          size={size}
          gutter={gutter}
        />
        <NumButton
          value="2"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_2}
          size={size}
          gutter={gutter}
        />
        <NumButton
          value="3"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_3}
          size={size}
          gutter={gutter}
        />
      </Row>
      <Row>
        <NumButton
          value="4"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_4}
          size={size}
          gutter={gutter}
        />
        <NumButton
          value="5"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_5}
          size={size}
          gutter={gutter}
        />
        <NumButton
          value="6"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_6}
          size={size}
          gutter={gutter}
        />
      </Row>
      <Row>
        <NumButton
          value="7"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_7}
          size={size}
          gutter={gutter}
        />
        <NumButton
          value="8"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_8}
          size={size}
          gutter={gutter}
        />
        <NumButton
          value="9"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_9}
          size={size}
          gutter={gutter}
        />
      </Row>
      <Row>
        {faceId ? (
          <NumButton
            value="face_id"
            onPress={onFaceIdPress}
            icon={require('../../assets/icons/face-id.png')}
            accessibilityLabel={intl.formatMessage({ id: 'onboarding.pinKeypad.accessibilityLabel.faceId' })}
            testID={testIDs.PIN_KEYPAD_BUTTON_FACEID}
            size={size}
            gutter={gutter}
          />
        ) : (
          <Gap size={size} gutter={gutter} />
        )}
        <NumButton
          value="0"
          onPress={onInput}
          onPressIn={onInputIn}
          onPressOut={onInputOut}
          testID={testIDs.PIN_KEYPAD_BUTTON_0}
          size={size}
          gutter={gutter}
        />
        {back ? (
          <NumButton
            value="delete"
            onPress={onBackPress}
            icon={require('../../assets/icons/keyboard-delete.png')}
            accessibilityLabel={intl.formatMessage({ id: 'onboarding.pinKeypad.accessibilityLabel.delete' })}
            testID={testIDs.PIN_KEYPAD_BUTTON_DELETE}
            size={size}
            gutter={gutter}
          />
        ) : (
          <Gap size={size} gutter={gutter} />
        )}
      </Row>
    </View>
  )
}
