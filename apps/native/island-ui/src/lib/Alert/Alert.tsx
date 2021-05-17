import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components/native';
import { theme, Colors } from '@island.is/island-ui/theme';
import info from '../../assets/alert/info-alert.png';
import close from '../../assets/alert/close.png';
import { View, Animated, SafeAreaView, Image } from 'react-native';

const Host = styled(Animated.View)<{ backgroundColor: Colors; borderColor: Colors; }>`
  position: absolute;
  left: 0;
  right: 0;
  padding: 20px 18px;
  background-color: ${(props) => {
    const value = theme.color[props.backgroundColor];
    if (props.theme.isDark && value === props.theme.color.blue100) {
      return props.theme.color.dark400;
    }
    return value;
  }};
  z-index: 10;
`;

const Icon = styled.View`
  align-items: center;
  justify-content: center;
`;

const Description = styled.Text`
  font-size: 13px;
  color: ${props => props.theme.shade.foreground};
  line-height: 17px;
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
  onClose?(): void;
  onClosed?(): void;
  visible?: boolean;
  hideIcon?: boolean;
}

const defaultOffsetY = {
  current: new Animated.Value(0),
};

export function Alert({ title, message, type, hideIcon = false, visible = true, onClose, onClosed, ...rest }: AlertProps) {

  const offsetY = useRef(new Animated.Value(0));
  const alertRef = useRef<View>(null);
  const variant = variantStyles[type];
  const [height, setHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(visible);

  const animateOut = () => {
    if (offsetY.current) {
      Animated.spring(offsetY.current, {
        toValue: -height,
        overshootClamping: true,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsVisible(false);
          onClosed && onClosed();
          if (offsetY.current) {
            offsetY.current.setValue(1);
          }
        }
      });
    }
  }

  useEffect(() => {
    if (!visible) {
      animateOut();
    }
  }, [visible]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <Host
        ref={alertRef as any}
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        backgroundColor={variant.background}
        borderColor={variant.borderColor}
        {...rest}
        style={{
          opacity: offsetY.current?.interpolate({
            inputRange: [-height, 0],
            outputRange: [0, 1],
          }),
          transform: [{
            translateY: offsetY.current,
          }],
        }}
      >
        <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
         {!hideIcon &&
            <Icon>
              <Image source={variant.icon} style={{ width: 19, height: 19, marginRight: 19 }} />
            </Icon>
          }
          {message && (
            <Content>
                <Description>{message}</Description>
            </Content>
          )}
          {onClose &&
            <Close onPress={onClose}>
              <Image source={close} style={{ width: 12, height: 12 }} />
            </Close>
          }
        </SafeAreaView>
      </Host>
    </>
  )
}
