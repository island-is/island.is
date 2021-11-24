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
  alwaysExpanded?: boolean
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
  alwaysExpanded = false,
}) => {
  const chevron = active ? 'chevronUp' : 'chevronDown'
  const showLock = enabled === false
  const showChevron = hasArray && !alwaysExpanded && !showLock
  return (
    <Box
      className={styles.navItemActive[`${active ? 'active' : 'inactive'}`]}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      cursor={showLock ? undefined : 'pointer'}
      position="relative"
      onClick={showLock ? (active ? onClick : undefined) : onClick}
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
              color={'blue400'}
            />
          </Box>
        ) : null}
        <Text
          fontWeight={'regular'}
          variant="sidebar"
          color={variant === 'blue' ? 'blue400' : 'blueberry600'}
        >
          {children}
        </Text>
      </Box>
      {showChevron && (
        <Icon type={'filled'} icon={chevron} size="medium" color={'blue400'} />
      )}
      {showLock && (
        <Icon
          type={'filled'}
          icon={'lockClosed'}
          size="small"
          color={'blue400'}
        />
      )}
    </Box>
  )
}

const NavItem: FC<Props> = (props) => {
  console.log(props.enabled, props.path)
  return props.external ? (
    <a href={props.path} target="_blank" rel="noreferrer noopener">
      <NavItemContent {...props} />
    </a>
  ) : props.path ? (
    props.enabled === false ? (
      <Link to={props.path}>
        <NavItemContent {...props} />
      </Link>
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
