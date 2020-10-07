import { Box, Typography } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './NavItem.treat'

interface Props {
  path?: ServicePortalPath
  active: boolean
  external?: boolean
  variant: 'blue' | 'purple'
  onClick?: () => void
}

const SubNavItemContent: FC<Props> = ({
  active,
  onClick,
  variant,
  children,
}) => (
  <Box
    display="flex"
    alignItems="center"
    cursor="pointer"
    position="relative"
    onClick={onClick}
  >
    <Typography
      fontWeight={active ? 'semiBold' : 'regular'}
      color={variant === 'blue' ? 'blue600' : 'blueberry600'}
    >
      <span className={styles.subNavItem}>{children}</span>
    </Typography>
  </Box>
)

const SubNavItem: FC<Props> = (props) => {
  return props.external ? (
    <a href={props.path} target="_blank">
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
