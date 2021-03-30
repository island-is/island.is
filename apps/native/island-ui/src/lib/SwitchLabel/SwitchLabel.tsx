import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.View`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;

  margin-bottom: ${(props) => props.theme.spacing.gutter}px;
`;

const Switch = styled.View`
  margin-right: 16px;
`;

const Title = styled.Text`
  font-weight: bold;
`;

interface SwitchLabelProps {
  children: React.ReactNode;
  title: string;
}

export function SwitchLabel({ children, title }: SwitchLabelProps) {
  return (
    <Host>
      <Switch>{children}</Switch>
      <Title>{title}</Title>
    </Host>
  )
}
