import { ReactNode, useEffect, useState } from 'react'
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
import { token, TokenSelector } from '../../utils'
import { Typography } from '../typography/typography'

export type AlertType = 'error' | 'info' | 'success' | 'warning'

export type AlertSize = 'default' | 'small'

interface AlertProps {
  type: AlertType
  size?: AlertSize
  title?: string
  message?: string
  style?: any

  onClose?(): void

  onClosed?(): void

  visible?: boolean
  hideIcon?: boolean
  /** Action rendered below the message */
  action?: ReactNode
  sharedAnimatedValue?: any
  hasBorder?: boolean
  hasBottomBorder?: boolean
}

interface HostProps {
  colours: VariantStyle
  hasBorder?: boolean
  hasBottomBorder?: boolean
  size: AlertSize
}

type VariantStyle = {
  background: TokenSelector
  border: TokenSelector
  icon: ImageSourcePropType
}

type VariantStyles = {
  [Type in AlertType]: VariantStyle
}

const Host = styled.View<HostProps>`
  padding: ${({ theme, size }) =>
    size === 'small' ? theme.spacing[1] : theme.spacing[2]}px;

  border-style: solid;
  border-color: ${(props) => token(props.colours.border)(props)};
  border-width: ${({ hasBorder }) => (hasBorder ? '1px' : 0)};
  ${({ hasBottomBorder }) => hasBottomBorder && 'border-bottom-width: 1px;'}
  border-radius: ${({ hasBorder }) => (hasBorder ? '8px' : 0)};

  background-color: ${(props) => token(props.colours.background)(props)};
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

// Transient `$size` so it isn't forwarded to Typography's own `size` (fontSize).
const Title = styled(Typography)<{ $size: AlertSize }>`
  margin-bottom: ${({ $size }) => ($size === 'small' ? '2px' : '4px')};
`

const Action = styled.View`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  align-self: flex-start;
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
    background: (t) => t.feedback.error.background,
    border: (t) => t.feedback.error.border,
    icon: error,
  },
  info: {
    background: (t) => t.feedback.information.backgroundMinimal,
    border: (t) => t.feedback.information.border,
    icon: info,
  },
  success: {
    background: (t) => t.feedback.success.background,
    border: (t) => t.feedback.success.border,
    icon: check,
  },
  warning: {
    background: (t) => t.feedback.warning.background,
    border: (t) => t.feedback.warning.border,
    icon: warning,
  },
}

export function Alert({
  title,
  message,
  type,
  size = 'default',
  hideIcon = false,
  visible = true,
  action,
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
  const isSmall = size === 'small'
  const iconSize = isSmall ? 24 : 32

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
      colours={variant}
      hasBorder={hasBorder}
      hasBottomBorder={hasBottomBorder}
      size={size}
      {...rest}
    >
      <Container>
        {!hideIcon && (
          <Icon>
            <Image
              source={variant.icon}
              style={{
                width: iconSize,
                height: iconSize,
                marginRight: isSmall ? 8 : 16,
              }}
            />
          </Icon>
        )}

        {(message || title || action) && (
          <Content>
            {title && (
              <Title variant={isSmall ? 'eyebrow' : 'heading5'} $size={size}>
                {title}
              </Title>
            )}
            {message && <Typography variant="body3">{message}</Typography>}
            {action && <Action>{action}</Action>}
          </Content>
        )}

        {onClose && (
          <Close onPressIn={onClose}>
            <CloseIcon
              source={close}
              style={{
                tintColor: theme.tokens.foreground.primary,
              }}
            />
          </Close>
        )}
      </Container>
    </Host>
  )
}
