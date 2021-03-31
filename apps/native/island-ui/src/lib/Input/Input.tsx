import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';
import { TextInput, TextInputProps } from 'react-native';

const Host = styled.TextInput`
  padding: 16px 16px;
  margin-bottom: ${(props) => props.theme.spacing.gutter}px;

  border: ${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard};
  border-radius: ${theme.border.radius.large};
  color: ${theme.color.dark400};
  font-size: 18px;
`;

interface InputProps extends TextInputProps {
}

export function Input({ ...rest }: InputProps) {
  return (
    <Host {...rest} />
  )
}
