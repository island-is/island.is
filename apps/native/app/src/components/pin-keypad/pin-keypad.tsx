import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';

interface PinKeypadProps {
  onInput?(value: string): void;
  onInputIn?(value: string): void;
  onInputOut?(value: string): void;
  onFaceIdPress?(value: string): void;
  onBackPress?(value: string): void;
  faceId?: boolean;
  back?: boolean;
}

interface NumButtonProps {
  value: string;
  icon?: any;
  accessibilityLabel?: string;
  onPress?(value: string): void;
  onPressIn?(value: string): void;
  onPressOut?(value: string): void;
}

const NumButtonTouchable = styled.TouchableHighlight`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.color.blue100};
  margin: 16px;
`;

const NumButtonText = styled.Text<{ color: string }>`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 32px;
  color: ${(props) => props.color};
`;

const Gap = styled.View`
  width: 64px;
  height: 64px;
  margin: 16px;
`;

function NumButton({ value, icon, onPress, onPressIn, onPressOut, accessibilityLabel }: NumButtonProps) {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    if (pressed && onPressIn) {
      onPressIn(value);
    }
    if (!pressed && onPressOut) {
      onPressOut(value);
    }
  }, [pressed]);

  const tintColor = pressed ? theme.color.white : theme.color.blue400;

  return (
    <NumButtonTouchable
      underlayColor={theme.color.blue400}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => onPress && onPress(value)}
      accessibilityLabel={accessibilityLabel}
    >
      {icon ? (
        <Image source={icon} style={{ tintColor }} />
      ) : (
        <NumButtonText color={tintColor}>{value}</NumButtonText>
      )}
    </NumButtonTouchable>
  );
}

const Row = styled.View`
  flex-direction: row;
`;

export function PinKeypad({ faceId, back, onInput, onInputIn, onInputOut, onFaceIdPress, onBackPress }: PinKeypadProps) {
  return (
    <View>
      <Row>
        <NumButton value="1" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
        <NumButton value="2" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
        <NumButton value="3" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
      </Row>
      <Row>
        <NumButton value="4" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
        <NumButton value="5" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
        <NumButton value="6" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
      </Row>
      <Row>
        <NumButton value="7" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
        <NumButton value="8" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
        <NumButton value="9" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
      </Row>
      <Row>
        {faceId ? <NumButton value="face_id" onPress={onFaceIdPress} icon={require('../../assets/icons/face-id.png')} accessibilityLabel="Use FaceID" /> : <Gap />}
        <NumButton value="0" onPress={onInput} onPressIn={onInputIn} onPressOut={onInputOut} />
        {back ? <NumButton value="delete" onPress={onBackPress} icon={require('../../assets/icons/keyboard-delete.png')} accessibilityLabel="Delete character" /> : <Gap />}
      </Row>
    </View>
  )

}
