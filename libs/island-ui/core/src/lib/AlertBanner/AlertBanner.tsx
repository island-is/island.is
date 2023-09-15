import { FC, useState } from 'react'
import { Colors } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import * as styles from './AlertBanner.css'
import { Icon } from '../IconRC/Icon'
import { IconMapIcon } from '../IconRC/types'
import { Text } from '../Text/Text'
import { LinkContext } from '../context/LinkContext/LinkContext'
import { LinkV2 } from '../Link/LinkV2'

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
  icon?: IconMapIcon
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
    icon: 'checkmark',
  },
  warning: {
    background: 'yellow200',
    borderColor: 'yellow400',
    iconColor: 'yellow600',
    icon: 'warning',
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
   * Fires when banner gets dismissed, useful for keeping track in storage that the user has dismissed the banner if we don't want it to show up again on page reload
   */
  onDismiss?: () => void
}

export const AlertBanner: FC<React.PropsWithChildren<AlertBannerProps>> = ({
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
      paddingLeft={[3, 3, 3, 6]}
      paddingRight={[3, 3, 3, 6]}
      paddingY={2}
      borderBottomWidth="standard"
      display="flex"
      alignItems={['flexStart', 'flexStart', 'flexStart', 'center']}
      position="relative"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      {variant.icon && (
        <Box
          display="flex"
          marginRight={[0, 0, 0, 2]}
          marginBottom={[2, 2, 2, 0]}
        >
          <Icon icon={variant.icon} color={variant.iconColor} />
        </Box>
      )}
      {title && (
        <Box marginRight={[0, 0, 0, 2]} marginBottom={[1, 1, 1, 0]}>
          <Text variant="h4">{title}</Text>
        </Box>
      )}
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection={['column', 'column', 'column', 'row']}
      >
        {(description || link) && (
          <Box marginRight={[0, 0, 0, 2]} marginBottom={[1, 1, 1, 0]}>
            <LinkContext.Provider
              value={{
                linkRenderer: (href, children) => (
                  <LinkV2
                    href={href}
                    color="blue400"
                    underline="small"
                    underlineVisibility="always"
                  >
                    {children}
                  </LinkV2>
                ),
              }}
            >
              <Text>
                {description}
                {description && link && ` `}
                {link && <a href={link.href}>{link.title}</a>}
              </Text>
            </LinkContext.Provider>
          </Box>
        )}
      </Box>
      {dismissable && (
        <Box
          display="flex"
          alignItems="flexEnd"
          flexDirection="column"
          flexGrow={1}
        >
          <button
            className={styles.closeBtn}
            onClick={() => {
              setDismissed(true)
              if (onDismiss) {
                onDismiss()
              }
            }}
          >
            <Icon icon="close" color="dark400" />
          </button>
        </Box>
      )}
    </Box>
  )
}
