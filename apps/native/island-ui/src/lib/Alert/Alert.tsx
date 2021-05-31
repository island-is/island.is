import { Colors, theme } from '@island.is/island-ui/theme'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  View,
} from 'react-native'
import styled from 'styled-components/native'
import close from '../../assets/alert/close.png'
import info from '../../assets/alert/info-alert.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

export type AlertType = 'error' | 'info' | 'success' | 'warning'

interface AlertProps {
  type: AlertType
  message?: string
  style?: any
  onClose?(): void
  onClosed?(): void
  visible?: boolean
  hideIcon?: boolean
  sharedAnimatedValue?: any
}

interface HostProps {
  backgroundColor: Colors
  borderColor: Colors
}

type VariantStyle = {
  background: Colors
  borderColor: Colors
  icon: ImageSourcePropType
}

type VariantStyles = {
  [Type in AlertType]: VariantStyle
}

const darkBackgroundColor = (color: string, colors: any) => {
  if (color === colors.blue100) {
    return '#001333'
  }
  return color;
}

const Host = styled(Animated.View)<HostProps>`
  position: absolute;
  left: 0;
  right: 0;
  padding: 20px 18px;
  background-color: ${dynamicColor(props => ({
    light: props.theme.color[props.backgroundColor],
    dark: darkBackgroundColor(props.theme.color[props.backgroundColor], props.theme.color),
  }))};
  z-index: 10;
`

const Icon = styled.View`
  align-items: center;
  justify-content: center;
`

const Message = styled.Text`
  ${font({
    fontSize: 13,
  })}
`

const Content = styled.View`
  padding-right: 34px;
  flex: 1;
`

const Close = styled.TouchableOpacity`
  padding: 10px;
  justify-content: center;
  align-items: center;
`

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

export function Alert({
  message,
  type,
  hideIcon = false,
  visible = true,
  onClose,
  onClosed,
  sharedAnimatedValue,
  ...rest
}: AlertProps) {
  const offsetY = sharedAnimatedValue ?? useRef(new Animated.Value(0)).current
  const alertRef = useRef<View>(null)
  const variant = variantStyles[type]
  const [height, setHeight] = useState(0)
  const [isVisible, setIsVisible] = useState(visible)

  const animateOut = () => {
    if (offsetY) {
      Animated.spring(offsetY, {
        toValue: -height,
        overshootClamping: true,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsVisible(false)
          onClosed && onClosed()
          if (offsetY) {
            offsetY.setValue(1)
          }
        }
      })
    }
  }

  useEffect(() => {
    if (!visible) {
      animateOut()
    }
  }, [visible])

  if (!isVisible) {
    return null
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
          opacity: offsetY?.interpolate({
            inputRange: [-height, 0],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateY: offsetY,
            },
          ],
        }}
      >
        <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!hideIcon && (
            <Icon>
              <Image
                source={variant.icon}
                style={{ width: 19, height: 19, marginRight: 19 }}
              />
            </Icon>
          )}
          {message && (
            <Content>
              <Message>{message}</Message>
            </Content>
          )}
          {onClose && (
            <Close onPress={onClose}>
              <Image
                source={close as ImageSourcePropType}
                style={{ width: 12, height: 12 }}
              />
            </Close>
          )}
        </SafeAreaView>
      </Host>
    </>
  )
}
