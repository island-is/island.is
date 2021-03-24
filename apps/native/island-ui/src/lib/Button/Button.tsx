import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

interface ButtonProps {
  title: string,
  onPress: () => void,
  style?: any,
}

const Host = styled.TouchableHighlight`
  padding: ${theme.spacing.p3}px ${theme.spacing.p4}px;
  background-color: ${theme.color.blue400};
  border-radius: ${theme.border.radius.large};
  min-width: 192px;
`;

const Text = styled.Text`
  color: #fff;
  text-align: center;
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  line-height: 20px;
`;

export function Button({ title, onPress, style, ...rest }: ButtonProps) {
  return (
    <Host onPress={onPress} style={style} {...rest}>
      <Text>{title}</Text>
    </Host>
  )
}
