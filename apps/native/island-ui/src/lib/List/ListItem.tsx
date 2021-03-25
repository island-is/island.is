import { theme } from '@island.is/island-ui/theme';
import React from 'react'
import { Linking, TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';

const Host = styled.View`
  border-bottom-width: ${theme.border.width.standard}px;
  border-color: ${theme.color.blue200};
`;

const Flex = styled.View`
  display: flex;
  flex-flow: row nowrap;
  padding: 20px 16px;
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
  margin-bottom: 8px;

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
  icon?: React.ReactNode;
  link?: string;
}

export function ListItem({ title, subtitle, icon, link }: ListItemProps) {
  const content = (
    <Flex>
      <Col>
        <IconWrap>
          {icon && (
            icon
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
    </Flex>
  );

  if (!link) {
    return (
      <Host>
        {content}
      </Host>
    )
  }

  return (
    <Host>
      <TouchableHighlight
        underlayColor={theme.color.blue100}
        onPress={() => { Linking.openURL(link) }}
      >
        {content}
      </TouchableHighlight>
    </Host>
  )
}
