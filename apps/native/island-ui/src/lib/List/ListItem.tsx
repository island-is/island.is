import React from 'react'
import { theme } from '@island.is/island-ui/theme';
import { TouchableHighlight, TouchableHighlightProps } from 'react-native';
import styled from 'styled-components/native';

const Host = styled.View`
  border-bottom-width: ${props => props.theme.border.width.standard}px;
  border-color: ${props => props.theme.shade.shade200};
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
  color: ${props => props.theme.shade.foreground};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.shade.foreground};
`;

interface ListItemProps extends TouchableHighlightProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export function ListItem({ title, subtitle, icon, ...rest }: ListItemProps) {
  return (
    <Host>
      <TouchableHighlight
        underlayColor={theme.color.blue100}
        {...rest}
      >
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
      </TouchableHighlight>
    </Host>
  )
}
