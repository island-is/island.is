import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.Text`
  display: flex;
  padding: 5px;

  font-size: 12px;
  font-weight: bold;

  background-color: ${theme.color.roseTinted100};
  border-radius: 5px;

  color: ${theme.color.roseTinted600};
`;

interface BadgeProps {
  title: string;
}

export function Badge({ title }: BadgeProps) {
  return (
    <Host>{title}</Host>
  )
}
