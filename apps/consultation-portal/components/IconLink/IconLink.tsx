import React from 'react'
import * as styles from './IconLink.css'
import { Box, Icon, IconProps, Text } from '@island.is/island-ui/core'

interface IconLinkProps {
  href?: string
  as?: string
  color?: 'white' | 'blue400' | 'blue200'
  onClick?: () => void
  icon?: IconProps
}

export const IconLink: React.FC<IconLinkProps> = ({
  href,
  as,
  children,
  color = 'blue400',
  onClick,
  icon,
}) => (
  <Box
    component={'div'}
    href={href}
    as={as}
    color={color}
    className={styles.root}
    onClick={onClick}
  >
    <Text variant="eyebrow" color={color}>
      {children}
      <span className={styles.iconWrap}>
        <Icon icon={icon.icon} size={icon.size} color="currentColor" />
      </span>
    </Text>
  </Box>
)
