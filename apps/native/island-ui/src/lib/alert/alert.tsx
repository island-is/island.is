import { Colors } from '@island.is/island-ui/theme'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  Image,
  ImageSourcePropType,
  LayoutAnimation,
  SafeAreaView,
  View,
} from 'react-native'
import styled from 'styled-components/native'
import close from '../../assets/alert/close.png'
import info from '../../assets/alert/info-alert.png'
import check from '../../assets/icons/check.png'
import error from '../../assets/icons/error.png'
import warning from '../../assets/icons/warning.png'
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
  return color
}

const Host = styled(Animated.View)<HostProps>`
  padding: 20px 18px;
  background-color: ${dynamicColor((props) => ({
    light: props.theme.color[props.backgroundColor],
    dark: darkBackgroundColor(
      props.theme.color[props.backgroundColor],
      props.theme.color,
    ),
  }))};
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
  const [hidden, setHidden] = useState<boolean>()
  const [height, setHeight] = useState(70)
  const variant = variantStyles[type]

  useEffect(() => {
    if (typeof hidden !== 'undefined') {
      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut,
        () => {
          setHidden(!visible)
        },
      )
    } else {
      setHidden(!visible)
    }
  }, [visible])

  if (hidden) {
    return null
  }

  return (
    <View style={!visible ? { height: 0 } : { height }}>
      <Host
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        backgroundColor={variant.background}
        borderColor={variant.borderColor}
        {...rest}
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
    </View>
  )
}
