import { Box, IconProps, Text, Icon } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import * as styles from './NavItem.treat'
import { Link } from 'react-router-dom'

interface Props {
  path?: ServicePortalPath
  icon?: Pick<IconProps, 'icon' | 'type'>
  active: boolean
  external?: boolean
  variant?: 'blue' | 'blueberry'
  onClick?: () => void
}

const NavItemContent: FC<Props> = ({
  icon,
  active,
  onClick,
  variant = 'blue',
  children,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      cursor="pointer"
      position="relative"
      onClick={onClick}
      className={styles.navItem}
    >
      <Box display="flex" height="full" alignItems="center">
        {icon ? (
          <Box display="flex" alignItems="center" marginRight={2}>
            <Icon
              type={icon.type}
              icon={icon.icon}
              size="medium"
              color={
                active
                  ? variant === 'blue'
                    ? 'blue600'
                    : 'blueberry600'
                  : variant === 'blue'
                  ? 'blue300'
                  : 'blueberry300'
              }
            />
          </Box>
        ) : null}
        <Text
          fontWeight={active ? 'semiBold' : 'regular'}
          color={variant === 'blue' ? 'blue600' : 'blueberry600'}
        >
          {children}
        </Text>
      </Box>
    </Box>
  )
}

const NavItem: FC<Props> = (props) => {
  return props.external ? (
    <a href={props.path} target="_blank" rel="noreferrer noopener">
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
