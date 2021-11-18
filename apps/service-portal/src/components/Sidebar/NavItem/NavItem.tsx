import { Box, IconProps, Text, Icon } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import * as styles from './NavItem.css'
import { Link } from 'react-router-dom'

interface Props {
  path?: ServicePortalPath
  icon?: Pick<IconProps, 'icon' | 'type'>
  active: boolean
  enabled?: boolean
  external?: boolean
  variant?: 'blue' | 'blueberry'
  hasArray?: boolean
  onClick?: () => void
}

const NavItemContent: FC<Props> = ({
  icon,
  active,
  enabled,
  hasArray,
  onClick,
  variant = 'blue',
  children,
}) => {
  const chevron = active ? 'chevronUp' : 'chevronDown'
  return (
    <Box
      className={styles.navItemActive[`${active ? 'active' : 'inactive'}`]}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      cursor={enabled === false ? undefined : 'pointer'}
      position="relative"
      onClick={enabled === false ? (active ? onClick : undefined) : onClick}
      paddingY={'p2'}
      paddingLeft={3}
      paddingRight={2}
    >
      <Box display="flex" height="full" alignItems="center">
        {icon ? (
          <Box display="flex" alignItems="center" marginRight={'p2'}>
            <Icon
              type={icon.type}
              icon={icon.icon}
              size="medium"
              color={enabled === false ? 'dark200' : 'blue400'}
            />
          </Box>
        ) : null}
        <Text
          fontWeight={'regular'}
          variant="sidebar"
          color={
            enabled === false
              ? 'dark200'
              : variant === 'blue'
              ? 'blue400'
              : 'blueberry600'
          }
        >
          {children}
        </Text>
      </Box>
      {hasArray && (
        <Icon
          type={'filled'}
          icon={chevron}
          size="medium"
          color={enabled === false ? 'dark200' : 'blue400'}
        />
      )}
    </Box>
  )
}

const NavItem: FC<Props> = (props) => {
  return props.external ? (
    <a href={props.path} target="_blank" rel="noreferrer noopener">
      <NavItemContent {...props} />
    </a>
  ) : props.path ? (
    props.enabled === false ? (
      <NavItemContent {...props} />
    ) : (
      <Link to={props.path}>
        <NavItemContent {...props} />
      </Link>
    )
  ) : (
    <NavItemContent {...props} />
  )
}

export default NavItem
