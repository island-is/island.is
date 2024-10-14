import { useEffect, useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  LayoutAnimation,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import close from '../../assets/alert/close.png'
import info from '../../assets/alert/info-alert.png'
import warning from '../../assets/alert/warning.png'
import check from '../../assets/icons/check.png'
import error from '../../assets/icons/error.png'
import { dynamicColor } from '../../utils'
import { Colors } from '../../utils/theme'
import { Typography } from '../typography/typography'

export type AlertType = 'error' | 'info' | 'success' | 'warning'

interface AlertProps {
  type: AlertType
  title?: string
  message?: string
  style?: any

  onClose?(): void

  onClosed?(): void

  visible?: boolean
  hideIcon?: boolean
  sharedAnimatedValue?: any
  hasBorder?: boolean
  hasBottomBorder?: boolean
}

interface HostProps {
  backgroundColor: Colors
  borderColor: Colors
  hasBorder?: boolean
  hasBottomBorder?: boolean
}

type VariantStyle = {
  background: Colors
  borderColor: Colors
  icon: ImageSourcePropType
}

type VariantStyles = {
  [Type in AlertType]: VariantStyle
}

export const DARK_YELLOW_200 = '#1b1700'

const darkBackgroundColor = (color: string, colors: any) => {
  if (color === colors.blue100) {
    return '#001333'
  }
  if (color === colors.yellow200) {
    return DARK_YELLOW_200
  }
  return color
}

const Host = styled.View<HostProps>`
  padding: ${({ theme }) => theme.spacing[2]}px;

  border-style: solid;
  border-color: ${dynamicColor((props) => ({
    light: props.theme.color[props.borderColor],
    dark: darkBackgroundColor(
      props.theme.color[props.borderColor],
      props.theme.color,
    ),
  }))};
  border-width: ${({ hasBorder }) => (hasBorder ? '1px' : 0)};
  ${({ hasBottomBorder }) => hasBottomBorder && 'border-bottom-width: 1px;'}
  border-radius: ${({ hasBorder }) => (hasBorder ? '8px' : 0)};

  background-color: ${dynamicColor((props) => ({
    light: props.theme.color[props.backgroundColor],
    dark: darkBackgroundColor(
      props.theme.color[props.backgroundColor],
      props.theme.color,
    ),
  }))};
`

const Container = styled(SafeAreaView)`
  flex-direction: row;
  align-items: center;
`

const Icon = styled.View`
  align-items: center;
  justify-content: center;
  align-self: flex-start;
`

const Content = styled.View`
  padding-right: ${({ theme }) => theme.spacing[2]}px;
  flex: 1;
`

const Title = styled(Typography)`
  margin-bottom: 4px;
`

const Close = styled(TouchableOpacity)`
  padding: 10px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
`

const CloseIcon = styled.Image`
  width: 12px;
  height: 12px;
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
  title,
  message,
  type,
  hideIcon = false,
  visible = true,
  onClose,
  onClosed,
  sharedAnimatedValue,
  hasBorder,
  hasBottomBorder,
  ...rest
}: AlertProps) {
  const theme = useTheme()
  const [hidden, setHidden] = useState<boolean>()
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
    <Host
      backgroundColor={variant.background}
      borderColor={variant.borderColor}
      hasBorder={hasBorder}
      hasBottomBorder={hasBottomBorder}
      {...rest}
    >
      <Container>
        {!hideIcon && (
          <Icon>
            <Image
              source={variant.icon}
              style={{
                width: 32,
                height: 32,
                marginRight: 16,
              }}
            />
          </Icon>
        )}

        {(message || title) && (
          <Content>
            {title && <Title variant="heading5">{title}</Title>}
            {message && <Typography variant="body3">{message}</Typography>}
          </Content>
        )}

        {onClose && (
          <Close onPressIn={onClose}>
            <CloseIcon
              source={close}
              style={{
                tintColor: theme.isDark
                  ? theme.color.white
                  : theme.color.dark400,
              }}
            />
          </Close>
        )}
      </Container>
    </Host>
  )
}
