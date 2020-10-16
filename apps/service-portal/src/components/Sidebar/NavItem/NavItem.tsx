import { Box, IconProps, Typography, Icon } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './NavItem.treat'
import { Link } from 'react-router-dom'

interface Props {
  path?: ServicePortalPath
  icon?: Pick<IconProps, 'icon' | 'type'>
  active: boolean
  external?: boolean
  variant: 'blue' | 'purple'
  onClick?: () => void
}

const NavItemContent: FC<Props> = ({
  icon,
  active,
  onClick,
  variant,
  children,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      cursor="pointer"
      position="relative"
      onClick={onClick}
      className={styles.navItem}
    >
      {icon ? (
        <Box display="flex" height="full" alignItems="center" marginRight={2}>
          <Icon
            type={icon.type}
            icon={icon.icon}
            size="medium"
            color={
              variant === 'blue'
                ? active
                  ? 'blue600'
                  : 'blue300'
                : active
                ? 'blueberry600'
                : 'blueberry300'
            }
          />
        </Box>
      ) : null}
      <Box
        className={cn(
          styles.dot,
          styles.dotState[active ? 'active' : 'inactive'],
        )}
        position="absolute"
        background={variant === 'blue' ? 'blue600' : 'blueberry600'}
        borderRadius="circle"
      />
      <Typography
        fontWeight={active ? 'semiBold' : 'regular'}
        color={variant === 'blue' ? 'blue600' : 'blueberry600'}
      >
        {children}
      </Typography>
    </Box>
  )
}

const NavItem: FC<Props> = (props) => {
  return props.external ? (
    <a href={props.path} target="_blank">
      <NavItemContent {...props} />
    </a>
  ) : props.path ? (
    <Link to={props.path}>
      <NavItemContent {...props} />
    </Link>
  ) : (
    <NavItemContent {...props} />
  )
}

export default NavItem
