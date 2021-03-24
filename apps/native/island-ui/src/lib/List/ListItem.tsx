import { theme } from '@island.is/island-ui/theme';
import React from 'react'
import { Text, Image } from 'react-native';
import styled from 'styled-components/native';

const Host = styled.View`
  display: flex;
  flex-flow: row nowrap;
  padding: 20px 16px;

  border-bottom-width: ${theme.border.width.standard}px;
  border-color: ${theme.color.blue200};
`;

const Col = styled.View`
`;

const IconWrap = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 25px;
  margin-right: 16px;
`;

const Title = styled.Text`
  margin-bottom: 10px;

  font-size: 12px;
  font-weight: bold;
  color: ${theme.color.dark400};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${theme.color.dark400};
`;

interface ListItemProps {
  title: string;
  subtitle: string;
  icon?: any;
}

export function ListItem({ title, subtitle, icon }: ListItemProps) {
  return (
    <Host>
      <Col>
        <IconWrap>
          {icon && (
            <Image
              source={icon}
              resizeMode="contain"
              style={{ width: 25, height: 25 }}
            />
          )}
        </IconWrap>
      </Col>
      <Col>
        <Title>
          {title}
        </Title>
        <Subtitle>
          {subtitle}
        </Subtitle>
      </Col>
    </Host>
  )
}
