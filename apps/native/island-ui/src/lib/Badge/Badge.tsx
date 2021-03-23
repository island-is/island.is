import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.Text`
  display: flex;
  padding: 5px 7px;

  font-size: 12px;
  font-weight: bold;
  color: ${theme.color.roseTinted600};

  border-radius: ${theme.border.radius.standard};
  background-color: ${theme.color.roseTinted100};
  overflow: hidden;
`;

interface BadgeProps {
  title: string;
}

export function Badge({ title }: BadgeProps) {
  return (
    <Host>{title}</Host>
  )
}
