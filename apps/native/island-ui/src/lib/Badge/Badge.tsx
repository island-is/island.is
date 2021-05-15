import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.View`
  overflow: hidden;
  border-radius: ${theme.border.radius.standard};
  background-color: ${theme.color.roseTinted100};
  padding: 5px 7px;
`;

const Text = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  color: ${theme.color.roseTinted400};

`;

interface BadgeProps {
  title: string;
}

export function Badge({ title }: BadgeProps) {
  return (
    <Host><Text>{title}</Text></Host>
  )
}
