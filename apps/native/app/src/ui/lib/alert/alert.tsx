import {Colors} from '../../utils/theme';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  LayoutAnimation,
  SafeAreaView,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import close from '../../assets/alert/close.png';
import info from '../../assets/alert/info-alert.png';
import check from '../../assets/icons/check.png';
import error from '../../assets/icons/error.png';
import warning from '../../assets/alert/warning.png';
import {dynamicColor} from '../../utils';
import {font} from '../../utils/font';

export type AlertType = 'error' | 'info' | 'success' | 'warning';

interface AlertProps {
  type: AlertType;
  title?: string;
  message?: string;
  style?: any;
  onClose?(): void;
  onClosed?(): void;
  visible?: boolean;
  hideIcon?: boolean;
  sharedAnimatedValue?: any;
  hasBorder?: boolean;
}

interface HostProps {
  backgroundColor: Colors;
  borderColor: Colors;
  hasBorder?: boolean;
}

type VariantStyle = {
  background: Colors;
  borderColor: Colors;
  icon: ImageSourcePropType;
};

type VariantStyles = {
  [Type in AlertType]: VariantStyle;
};

const darkBackgroundColor = (color: string, colors: any) => {
  if (color === colors.blue100) {
    return '#001333';
  }
  if (color === colors.yellow200) {
    return '#1b1700';
  }
  return color;
};

const Host = styled(Animated.View)<HostProps>`
  padding: 20px 18px;
  border-width: ${({hasBorder}) => (hasBorder ? '1px' : 0)};
  border-style: solid;
  border-color: ${dynamicColor(props => ({
    light: props.theme.color[props.borderColor],
    dark: darkBackgroundColor(
      props.theme.color[props.borderColor],
      props.theme.color,
    ),
  }))};
  border-radius: ${({hasBorder}) => (hasBorder ? '8px' : 0)};
  background-color: ${dynamicColor(props => ({
    light: props.theme.color[props.backgroundColor],
    dark: darkBackgroundColor(
      props.theme.color[props.backgroundColor],
      props.theme.color,
    ),
  }))};
`;

const Icon = styled.View`
  align-items: center;
  justify-content: center;
  align-self: flex-start;
`;

const Title = styled.Text`
  ${font({
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  })}
  margin-bottom: 4px;
`;

const Message = styled.Text`
  ${font({
    fontSize: 13,
  })}
`;

const Content = styled.View`
  padding-right: 34px;
  flex: 1;
`;

const Close = styled.TouchableOpacity`
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const variantStyles: VariantStyles = {
  error: {
    background: 'red100',
    borderColor: 'red200',
    icon: error,
  },
  info: {
    background: 'blue100',
    borderColor: 'blue200',
    icon: info,
  },
  success: {
    background: 'mint100',
    borderColor: 'mint200',
    icon: check,
  },
  warning: {
    background: 'yellow200',
    borderColor: 'yellow400',
    icon: warning,
  },
};

export function Alert({
  title,
  message,
  type,
  hideIcon = false,
  visible = true,
  onClose,
  onClosed,
  sharedAnimatedValue,
  hasBorder,
  ...rest
}: AlertProps) {
  const [hidden, setHidden] = useState<boolean>();
  const [height, setHeight] = useState(70);
  const variant = variantStyles[type];

  useEffect(() => {
    if (typeof hidden !== 'undefined') {
      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut,
        () => {
          setHidden(!visible);
        },
      );
    } else {
      setHidden(!visible);
    }
  }, [visible]);

  if (hidden) {
    return null;
  }

  return (
    <View style={!visible ? {height: 0} : {height}}>
      <Host
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onLayout={e => setHeight(e.nativeEvent.layout.height)}
        backgroundColor={variant.background}
        borderColor={variant.borderColor}
        hasBorder={hasBorder}
        {...rest}>
        <SafeAreaView style={{flexDirection: 'row', alignItems: 'center'}}>
          {!hideIcon && (
            <Icon>
              <Image
                source={variant.icon}
                style={{width: 32, height: 32, marginRight: 16}}
              />
            </Icon>
          )}
          {message && (
            <Content>
              {title && <Title>{title}</Title>}
              <Message>{message}</Message>
            </Content>
          )}
          {onClose && (
            <Close onPress={onClose}>
              <Image
                source={close as ImageSourcePropType}
                style={{width: 12, height: 12}}
              />
            </Close>
          )}
        </SafeAreaView>
      </Host>
    </View>
  );
}
