import React from 'react'
import styled from 'styled-components/native';
import { theme, Colors } from '@island.is/island-ui/theme';
import info from '../../assets/alert/info-alert.png';
import close from '../../assets/alert/close.png';
import { Image } from 'react-native';
import { ImageSourcePropType } from 'react-native';

const Host = styled.View<{ backgroundColor: Colors; borderColor: Colors; }>`
  display: flex;
  flex-flow: row nowrap;
  padding: 20px 18px;
  background-color: ${(props) => theme.color[props.backgroundColor]};
`;

const Icon = styled.View`
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: ${theme.typography.semiBold};
  color: ${theme.color.dark400};
  line-height: 24px;
  margin-bottom: 15px;

`;

const Description = styled.Text`
  font-size: 12px;
  color: ${theme.color.dark400};
  line-height: 16px;
`;

const Content = styled.View`
  padding-right: 48px;
  flex: 1;
`;

const Close = styled.View`
  justify-content: center;
  align-items: center;
`;

export type AlertType = 'error' | 'info' | 'success' | 'warning'

type VariantStyle = {
  background: Colors
  borderColor: Colors
  icon: any
}

type VariantStyles = {
  [Type in AlertType]: VariantStyle
}

const variantStyles: VariantStyles = {
  error: {
    background: 'red100',
    borderColor: 'red200',
    icon: info,
  },
  info: {
    background: 'blue100',
    borderColor: 'blue200',
    icon: info,
  },
  success: {
    background: 'mint100',
    borderColor: 'mint200',
    icon: info,
  },
  warning: {
    background: 'yellow200',
    borderColor: 'yellow400',
    icon: info,
  },
}

interface AlertProps {
  type: AlertType,
  title?: string,
  message?: string,
  style?: any;
}

export function Alert({ title, message, type, ...rest }: AlertProps) {
  const variant = variantStyles[type];
  return (
    <Host backgroundColor={variant.background} borderColor={variant.borderColor} {...rest}>
      <Icon>
        <Image source={variant.icon} style={{ width: 19, height: 19, marginRight: 19 }} />
      </Icon>
      <Content>
        {title && <Title>{title}</Title>}
        {message && (
          <Description>{message}</Description>
        )}
      </Content>
      {/* <Close onPress={() => console.log('smella')}>
        <Image source={close} style={{ width: 12, height: 12 }} />
      </Close> */}
    </Host>
  )
}
