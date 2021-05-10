import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components/native';
import { theme, Colors } from '@island.is/island-ui/theme';
import info from '../../assets/alert/info-alert.png';
import close from '../../assets/alert/close.png';
import { Image } from 'react-native';
import { View, Animated } from 'react-native';

const Host = styled(Animated.View)<{ backgroundColor: Colors; borderColor: Colors; }>`
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

const Close = styled.TouchableOpacity`
  padding: 10px;
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
  offsetY?: any;
}

export function Alert({ title, message, type, offsetY, ...rest }: AlertProps) {
  const alertRef = useRef<View>(null);
  const variant = variantStyles[type];
  const [isVisible, setIsVisible] = useState(true);
  const [height, setHeight] = useState(0);

  const animateOut = () => {
    Animated.spring(offsetY.current, {
      toValue: -height,
      overshootClamping: true,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsVisible(false);
        offsetY.current.setValue(1);
      }
    });
  }

  return (
    <>
      {isVisible ?
        <Host
          ref={alertRef as any}
          onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
          backgroundColor={variant.background}
          borderColor={variant.borderColor}
          {...rest}
          style={{
            opacity: offsetY.current.interpolate({
              inputRange: [-height, 0],
              outputRange: [0, 1],
            }),
            transform: [{
              translateY: offsetY.current,
            }],
          }}
        >
          <Icon>
            <Image source={variant.icon} style={{ width: 19, height: 19, marginRight: 19 }} />
          </Icon>
          <Content>
            {title && <Title>{title}</Title>}
            {message && (
              <Description>{message}</Description>
            )}
          </Content>
          <Close onPress={animateOut}>
            <Image source={close} style={{ width: 12, height: 12 }} />
          </Close>
        </Host> :
        null
      }
    </>
  )
}
