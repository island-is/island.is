import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

interface ButtonProps {
  title: string,
  onPress: () => void,
  style?: any,
}

const Host = styled.TouchableHighlight`
  padding: 20px 30px;
  background-color: ${theme.color.blue600};
  border-radius: ${theme.border.radius.standard};
  min-width: 250px;
`;

const Text = styled.Text`
  color: #fff;
  text-align: center;
`;

export function Button({ title, onPress, style, ...rest }: ButtonProps) {
  return (
    <Host onPress={onPress} style={style} {...rest}>
      <Text>{title}</Text>
    </Host>
  )
}
