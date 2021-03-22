import { theme } from '@island.is/island-ui/theme';
import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  flex: 1;
  padding: 20px 30px;

  border-bottom-width: ${theme.border.width.standard}px;
  border-color: ${theme.color.blue200};
`;

const Title = styled.Text`
  margin-bottom: 10px;

  font-size: 12px;
  font-weight: bold;
`;

const Description = styled.Text`
  font-size: 16px;
`;

interface ListItemProps {
  title: string;
  description: string;
  icon?: React.ReactElement;
}

export function ListItem({ title, description, icon }: ListItemProps) {
  return (
    <Host>
      <Title>
        {title}
      </Title>
      <Description>
        {description}
      </Description>
    </Host>
  )
}
