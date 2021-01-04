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
  notifications?: number
}

const NavItemContent: FC<Props> = ({
  icon,
  active,
  onClick,
  variant = 'blue',
  notifications,
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
      {notifications ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginLeft={1}
          borderRadius="circle"
          className={styles.notification}
          background={variant === 'blue' ? 'blue400' : 'blueberry400'}
        >
          <Text variant="small" fontWeight="semiBold" color="white">
            {notifications}
          </Text>
        </Box>
      ) : null}
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
