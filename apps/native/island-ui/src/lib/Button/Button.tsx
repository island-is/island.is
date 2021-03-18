import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

interface ButtonProps {
  title: string,
  onPress: () => void,
}

const Host = styled.TouchableHighlight`
  padding: 20px 30px;
  background-color: ${theme.color.blue600};
  border-radius: 5px;
  min-width: 250px;
`;

const Text = styled.Text`
  color: #fff;
  text-align: center;
`;

export function Button({ title, onPress }: ButtonProps) {
  return (
    <Host onPress={onPress}>
      <Text>{title}</Text>
    </Host>
  )
}
