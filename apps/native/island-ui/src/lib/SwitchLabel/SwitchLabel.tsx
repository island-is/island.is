import React from 'react'
import styled from 'styled-components/native';

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
  onPress?: () => void;
}

export function SwitchLabel({ children, title, onPress }: SwitchLabelProps) {
  return (
    <Host>
      <Switch>{children}</Switch>
      <Title onPress={onPress}>{title}</Title>
    </Host>
  )
}
