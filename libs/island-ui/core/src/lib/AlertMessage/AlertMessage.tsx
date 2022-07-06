import * as React from 'react'
import { Text } from '../Text/Text'
import { Icon } from '../IconRC/Icon'
import { Icon as IconType } from '../IconRC/iconMap'
import { Colors } from '@island.is/island-ui/theme'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'

export type AlertMessageType = 'error' | 'info' | 'success' | 'warning'

type VariantStyle = {
  background: Colors
  borderColor: Colors
  iconColor: Colors
  icon: IconType
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
}

export interface AlertMessageProps {
  type: AlertMessageType
  testid?: string
}

type TitleAndOrMessage =
  | {
      title: string
      message: string | React.ReactNode
    }
  | {
      title?: never
      message: string | React.ReactNode
    }
  | {
      title: string
      message?: never
    }

export const AlertMessage: React.FC<AlertMessageProps & TitleAndOrMessage> = ({
  type,
  title,
  message,
  testid,
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
      <Box display="flex">
        <Box display="flex" marginRight={[1, 1, 2]}>
          <Icon type="filled" color={variant.iconColor} icon={variant.icon} />
        </Box>
        <Box display="flex" width="full" flexDirection="column">
          <Stack space={1}>
            {title && (
              <Text as="h5" variant="h5">
                {title}
              </Text>
            )}
            {message &&
              (React.isValidElement(message) ? (
                message
              ) : (
                <Text variant="small">{message}</Text>
              ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
