import { Box, Text } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './NavItem.treat'

interface Props {
  path?: ServicePortalPath
  active: boolean
  enabled?: boolean
  external?: boolean
  variant?: 'blue' | 'blueberry'
  onClick?: () => void
}

const SubNavItemContent: FC<Props> = ({
  active,
  onClick,
  enabled,
  variant = 'blue',
  children,
}) => (
  <Box
    display="flex"
    alignItems="center"
    cursor={enabled === false ? undefined : 'pointer'}
    position="relative"
    onClick={enabled === false ? undefined : onClick}
  >
    <Text
      fontWeight={active ? 'semiBold' : 'regular'}
      color={
        enabled === false
          ? 'dark200'
          : variant === 'blue'
          ? 'blue600'
          : 'blueberry600'
      }
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
    props.enabled === false ? (
      <SubNavItemContent {...props} />
    ) : (
      <Link to={props.path}>
        <SubNavItemContent {...props} />
      </Link>
    )
  ) : (
    <SubNavItemContent {...props} />
  )
}

export default SubNavItem
