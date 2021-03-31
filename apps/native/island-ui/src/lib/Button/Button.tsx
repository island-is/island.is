import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';
import { TouchableHighlightProps } from 'react-native';

interface ButtonProps extends TouchableHighlightProps {
  title: string;
  disabled?: boolean;
}

const Host = styled.TouchableHighlight<{ disabled?: boolean }>`
  padding: ${theme.spacing.p3}px ${theme.spacing.p4}px;
  background-color: ${(props) => props.disabled ? theme.color.dark200 : theme.color.blue400};
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

export function Button({ title, ...rest }: ButtonProps) {
  return (
    <Host
      underlayColor={theme.color.blue600}
      {...rest}
    >
      <Text>{title}</Text>
    </Host>
  )
}
