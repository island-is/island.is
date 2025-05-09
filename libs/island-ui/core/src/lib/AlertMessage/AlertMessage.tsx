import React, { FC, ReactNode, isValidElement } from 'react'
import { Text } from '../Text/Text'
import { Icon } from '../IconRC/Icon'
import { Icon as IconType } from '../IconRC/iconMap'
import { Colors } from '@island.is/island-ui/theme'
import { Box } from '../Box/Box'

export type AlertMessageType =
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | 'default'

type VariantStyle = {
  background: Colors
  borderColor: Colors
  iconColor?: Colors
  icon?: IconType
}

type VariantStyles = {
  [Type in AlertMessageType]: VariantStyle
}

const variantStyles: VariantStyles = {
  error: {
    background: 'red100',
    borderColor: 'red200',
    iconColor: 'red400',
    icon: 'warning',
  },
  info: {
    background: 'blue100',
    borderColor: 'blue200',
    iconColor: 'blue400',
    icon: 'informationCircle',
  },
  success: {
    background: 'mint100',
    borderColor: 'mint200',
    iconColor: 'mint400',
    icon: 'checkmarkCircle',
  },
  warning: {
    background: 'yellow200',
    borderColor: 'yellow400',
    iconColor: 'yellow600',
    icon: 'warning',
  },
  default: {
    background: 'purple100',
    borderColor: 'purple200',
  },
}

export interface AlertMessageProps {
  type: AlertMessageType
  testid?: string
  action?: ReactNode
}

type TitleAndOrMessage =
  | {
      title: string | ReactNode
      message: string | ReactNode
    }
  | {
      title?: never
      message: string | ReactNode
    }
  | {
      title: string
      message?: never
    }

export const AlertMessage: FC<AlertMessageProps & TitleAndOrMessage> = ({
  type,
  title,
  message,
  testid,
  action,
}) => {
  const variant = variantStyles[type]

  return (
    <Box
      padding={[1, 1, 2]}
      borderRadius="large"
      background={variant.background}
      borderColor={variant.borderColor}
      borderWidth="standard"
      data-testid={testid ?? 'alertMessage'}
    >
      <Box display="flex" alignItems="flexStart">
        {variant.icon && (
          <Box display="flex" marginRight={[1, 1, 2]}>
            <Icon
              size="large"
              type="filled"
              color={variant.iconColor}
              icon={variant.icon}
            />
          </Box>
        )}
        <Box
          display="flex"
          width="full"
          flexDirection="column"
          alignSelf="center"
        >
          {title &&
            (typeof title === 'string' ? (
              <Text as="h5" variant="h5" marginBottom={message ? 1 : 0}>
                {title}
              </Text>
            ) : (
              title
            ))}
          {message && (
            <Box display="flex" alignItems="center">
              {isValidElement(message) ? (
                message
              ) : (
                <Box flexGrow={1}>
                  <Text variant="small">{message}</Text>
                </Box>
              )}
              {action && (
                <Box
                  display="flex"
                  style={{ alignSelf: 'flex-end' }}
                  justifyContent="flexEnd"
                  alignItems="flexEnd"
                >
                  {action}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
