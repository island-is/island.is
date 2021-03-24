import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.TextInput`
  padding: 10px 15px;
  margin-bottom: 15px;

  background-color: ${theme.color.blue100};
  border: ${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard};
  border-radius: ${theme.border.radius.large};
  color: ${theme.color.dark400};
`;

interface InputProps {
  placeholder: string;
}

export function Input({ placeholder }: InputProps) {
  return (
    <Host placeholder={placeholder} />
  )
}
