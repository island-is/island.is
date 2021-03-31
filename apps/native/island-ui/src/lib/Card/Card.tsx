import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';


const Host = styled.View<{ color: string }>`
  padding: 30px 30px;
  margin-bottom: 30px;
  margin-left: 30px;
  width: 260px;
  min-height: 350px;

  background-color: ${(props) => props.color};
  border-radius: ${theme.border.radius.large};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.color.dark400};
`;

interface CardProps {
  title: string;
  backgroundColor?: string;
}

export function Card({ title, backgroundColor = '#f5e4ec' }: CardProps) {
  return (
    <Host color={backgroundColor}>
      <Title>
        {title}
      </Title>
    </Host>
  )
}
