import * as React from 'react'
import { Text } from '../Text/Text'
import { Icon } from '../IconRC/Icon'
import { Icon as IconType } from '../IconRC/iconMap'
import { Colors } from '@island.is/island-ui/theme'
import { Box } from '../Box/Box'
import * as styles from './AlertMessage.treat'

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
    icon: 'alert',
  },
  info: {
    background: 'blue100',
    borderColor: 'blue200',
    iconColor: 'blue400',
    icon: 'information',
  },
  success: {
    background: 'mint100',
    borderColor: 'mint200',
    iconColor: 'mint400',
    icon: 'checkmark',
  },
  warning: {
    background: 'yellow200',
    borderColor: 'yellow400',
    iconColor: 'yellow600',
    icon: 'alert',
  },
}

export interface AlertMessageProps {
  type: AlertMessageType
  title: string
  message: string
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  title,
  message,
}) => {
  const variant = variantStyles[type]

  return (
    <Box
      padding={2}
      borderRadius="large"
      background={variant.background}
      borderColor={variant.borderColor}
      borderWidth="standard"
    >
      <Box display="flex" alignItems="center" marginBottom={1}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginRight={2}
          flexShrink={0}
          borderRadius="circle"
          background={variant.iconColor}
        >
          <Icon type="outline" icon={variant.icon} color="white" />
        </Box>
        <Text as="h5" variant="h5">
          {title}
        </Text>
      </Box>
      <Box className={styles.messageWrap}>
        <Text variant="small">{message}</Text>
      </Box>
    </Box>
  )
}
