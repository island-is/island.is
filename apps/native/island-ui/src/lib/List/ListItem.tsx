import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  flex: 1;
  padding: 20px 30px;

  border-bottom-width: ${props => props.theme.border.width.standard}px;
  border-color: ${props => props.theme.shade.shade200};
`;

const Title = styled.Text`
  margin-bottom: 10px;

  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.shade.foreground};
`;

const Description = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.shade.foreground};
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
