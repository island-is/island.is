import React, {useEffect, useState} from 'react';
import {FormattedDate} from 'react-intl';
import {Image, ImageSourcePropType, LayoutAnimation} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {dynamicColor} from '../../utils/dynamic-color';
import {font} from '../../utils/font';

const Host = styled.View`
  margin-bottom: ${({theme}) => theme.spacing[2]}px;
  border-radius: ${({theme}) => theme.border.radius.large};
`;

const Card = styled.TouchableHighlight<{open: boolean}>`
  border-radius: ${({theme}) => theme.border.radius.large};
  border-bottom-left-radius: ${({theme, open}) =>
    open ? 0 : theme.border.radius.large};
  border-bottom-right-radius: ${({theme, open}) =>
    open ? 0 : theme.border.radius.large};
  background-color: ${dynamicColor(props => ({
    dark: 'shade100',
    light: props.theme.color.blueberry100,
  }))};
`;

const Container = styled.View`
  padding: 16px 20px;
`;

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: ${({theme}) => theme.spacing[1]}px;
`;

const TitleText = styled.Text`
  flex: 1;

  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 17,
    color: 'foreground',
  })}
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Message = styled.Text`
  ${font({
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    color: 'foreground',
  })}
`;

const Expanded = styled.View`
  background-color: ${dynamicColor('background')};
  border-bottom-left-radius: ${({theme}) => theme.border.radius.large};
  border-bottom-right-radius: ${({theme}) => theme.border.radius.large};
`;

interface CardProps {
  icon?: ImageSourcePropType;
  title: React.ReactNode;
  message: React.ReactNode;
  value?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  onPress?: () => void;
}

const toggleAnimation = {
  duration: 300,
  create: {
    duration: 300,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  update: {
    duration: 300,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 200,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export function FinanceStatusCard({
  icon,
  title,
  message,
  value,
  children,
  open,
  onPress,
}: CardProps) {
  const theme = useTheme();
  return (
    <Host
      style={{
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: open ? 0.08 : 0,
        shadowRadius: 16,
        elevation: 1,
        shadowColor: 'rgb(0, 32, 128)',
      }}>
      <Card
        onPress={() => {
          LayoutAnimation.configureNext(toggleAnimation);
          onPress?.();
        }}
        underlayColor={theme.isDark ? theme.shade.shade200 : '#EBEBFA'}
        open={open}>
        <Container>
          <Row style={{marginBottom: 8}}>
            <Title>
              {icon && (
                <Image
                  source={icon}
                  style={{width: 16, height: 16, marginRight: 8}}
                />
              )}
              <TitleText numberOfLines={1} ellipsizeMode="tail">
                {title}
              </TitleText>
            </Title>
          </Row>
          <Row>
            <Message>{message}</Message>
            <Message>{value}</Message>
          </Row>
        </Container>
      </Card>
      {open && <Expanded>{children}</Expanded>}
    </Host>
  );
}
