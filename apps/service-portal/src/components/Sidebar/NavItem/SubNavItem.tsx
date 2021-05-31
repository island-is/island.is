import { Box, Text } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './NavItem.treat'

interface Props {
  path?: ServicePortalPath
  active: boolean
  external?: boolean
  variant?: 'blue' | 'blueberry'
  onClick?: () => void
}

const SubNavItemContent: FC<Props> = ({
  active,
  onClick,
  variant = 'blue',
  children,
}) => (
  <Box
    display="flex"
    alignItems="center"
    cursor="pointer"
    position="relative"
    onClick={onClick}
  >
    <Text
      fontWeight={active ? 'semiBold' : 'regular'}
      color={variant === 'blue' ? 'blue600' : 'blueberry600'}
    >
      <span className={styles.subNavItem}>{children}</span>
    </Text>
  </Box>
)

const SubNavItem: FC<Props> = (props) => {
  return props.external ? (
    <a href={props.path} target="_blank" rel="noreferrer noopener">
      <SubNavItemContent {...props} />
    </a>
  ) : props.path ? (
    <Link to={props.path}>
      <SubNavItemContent {...props} />
    </Link>
  ) : (
    <SubNavItemContent {...props} />
  )
}

export default SubNavItem
