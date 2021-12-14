import { Box, Icon, Text } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from '../NavItem/NavItem.css'
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
    cursor={'pointer'}
    position="relative"
    onClick={onClick}
    justifyContent={'spaceBetween'}
    paddingRight={2}
  >
    <Text
      fontWeight={active ? 'semiBold' : 'regular'}
      variant="small"
      color={variant === 'blue' ? 'blue600' : 'blueberry600'}
    >
      <span>{children}</span>
    </Text>
    {!enabled && (
      <Icon
        type={'filled'}
        icon={'lockClosed'}
        size="small"
        color={'blue600'}
        className={styles.subLock}
      />
    )}
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
