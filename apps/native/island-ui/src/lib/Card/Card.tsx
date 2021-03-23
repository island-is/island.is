import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';

const colorTheme = {
  pink: '#f5e4ec',
  yellow: '#fff7e7',
}

export enum CardColor {
  YELLOW = 'yellow',
  PINK = 'pink'
}

const Host = styled.View<{ color: string }>`
  padding: 30px 30px;
  margin-bottom: 30px;
  margin-left: 30px;
  min-width: 230px;
  min-height: 350px;

  background-color: ${(props) => props.color !== CardColor.YELLOW ? colorTheme.pink : colorTheme.yellow};
  border-radius: ${theme.border.radius.large};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

interface CardProps {
  title: string;
  color?: CardColor;
}

export function Card({ title, color = CardColor.PINK }: CardProps) {
  return (
    <Host color={color}>
      <Title>
        {title}
      </Title>
    </Host>
  )
}
