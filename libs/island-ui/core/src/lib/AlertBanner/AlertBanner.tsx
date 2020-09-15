import React, { FC, useState } from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import * as styles from './AlertBanner.treat'
import { Colors } from '@island.is/island-ui/theme'
import Icon, { IconTypes } from '../Icon/Icon'
import Typography from '../Typography/Typography'
import Link from '../Link/Link'

export type AlertBannerVariants =
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | 'default'

type VariantStyle = {
  background: Colors
  borderColor: Colors
  iconColor?: Colors
  icon?: IconTypes
}

type VariantStyles = {
  [Type in AlertBannerVariants]: VariantStyle
}

const variantStyles: VariantStyles = {
  default: {
    background: 'purple100',
    borderColor: 'purple200',
  },
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
    icon: 'info',
  },
  success: {
    background: 'mint100',
    borderColor: 'mint200',
    iconColor: 'mint400',
    icon: 'check',
  },
  warning: {
    background: 'yellow200',
    borderColor: 'yellow400',
    iconColor: 'yellow600',
    icon: 'alert',
  },
}

export interface AlertBannerProps {
  variant?: AlertBannerVariants
  /**
   * Adds close button in corner to remove banner
   */
  dismissable?: boolean
  title?: string
  description?: string
  link?: {
    href: string
    title: string
  }
  /**
   * Fires when banner gets dismissed, usefull for keeping track in storage that the user has dismissed the banner if we don't want it to show up again on page reload
   */
  onDismiss?: () => void
}

export const AlertBanner: FC<AlertBannerProps> = ({
  variant: variantKey = 'default',
  dismissable,
  title,
  description,
  link,
  onDismiss,
}) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  const variant = variantStyles[variantKey]
  return (
    <Box
      background={variant.background}
      borderColor={variant.borderColor}
      paddingLeft={[5, 5, 7]}
      paddingRight={[5, 5, 9]}
      paddingY={2}
      borderBottomWidth="standard"
      display="flex"
      position="relative"
      flexDirection={['column', 'column', 'row']}
      textAlign={['center', 'center', 'left']}
    >
      {variant.icon && (
        <Box marginRight={2} marginBottom={[2, 2, 0]}>
          <Icon type={variant.icon} color={variant.iconColor} />
        </Box>
      )}
      {title && (
        <Box marginRight={2} marginBottom={[1, 1, 0]}>
          <Typography variant="h4">{title}</Typography>
        </Box>
      )}
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection={['column', 'column', 'row']}
        textAlign={['center', 'center', 'left']}
      >
        {description && (
          <Box marginRight={2} marginBottom={[1, 1, 0]}>
            <Typography variant="p">{description}</Typography>
          </Box>
        )}
        {link && (
          <Typography links variant="p">
            <Link href={link.href}>{link.title}</Link>
          </Typography>
        )}
      </Box>
      {dismissable && (
        <Box position="absolute" className={styles.closeBtn}>
          <button
            onClick={() => {
              setDismissed(true)
              if (onDismiss) {
                onDismiss()
              }
            }}
          >
            <Icon type="close" color="dark400" width={14} />
          </button>
        </Box>
      )}
    </Box>
  )
}

export default AlertBanner
