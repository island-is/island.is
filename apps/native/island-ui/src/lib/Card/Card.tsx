import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const Host = styled.View`
  flex: 1;
  padding: 30px 30px;
  margin-bottom: 30px;
  margin-left: 30px;
  min-width: 230px;
  min-height: 350px;

  background-color: #f5e4ec;
  border-radius: ${theme.border.radius.large};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

interface CardProps {
  title: string;
}

export function Card({ title }: CardProps) {
  return (
    <Host>
      <Title>
        {title}
      </Title>
    </Host>
  )
}
