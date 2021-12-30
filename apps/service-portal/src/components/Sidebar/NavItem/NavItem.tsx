import { Box, IconProps, Icon } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import * as styles from './NavItem.css'
import { Link } from 'react-router-dom'
import { useStore } from '../../../store/stateProvider'

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
  badge?: boolean
}

const NavItemContent: FC<Props> = ({
  icon,
  active,
  enabled,
  hasArray,
  onClick,
  children,
  alwaysExpanded = false,
  badge = false,
}) => {
  const [{ sidebarState }] = useStore()
  const collapsed = sidebarState === 'closed'
  const chevron = active ? 'chevronUp' : 'chevronDown'
  const showLock = enabled === false
  const showChevron =
    hasArray && !alwaysExpanded && !showLock && sidebarState === 'open'
  const navItemActive: keyof typeof styles.navItemActive = active
    ? collapsed
      ? 'activeCollapsed'
      : 'active'
    : collapsed
    ? 'inactiveCollapsed'
    : 'inactive'
  const badgeActive: keyof typeof styles.badge = badge ? 'active' : 'inactive'
  return (
    <Box
      className={styles.navItemActive[navItemActive]}
      display="flex"
      alignItems="center"
      justifyContent={collapsed ? 'center' : 'spaceBetween'}
      cursor={showLock ? undefined : 'pointer'}
      position="relative"
      onClick={showLock ? (active ? onClick : undefined) : onClick}
      paddingY={1}
      paddingLeft={collapsed ? 1 : 3}
      paddingRight={collapsed ? 1 : 2}
    >
      <Box
        display="flex"
        height="full"
        alignItems="center"
        overflow="hidden"
        paddingX={[3, 0]}
      >
        {icon ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent={collapsed ? 'center' : 'flexStart'}
            marginRight={collapsed ? 0 : 1}
          >
            <Box
              borderRadius="circle"
              className={styles.badge[badgeActive]}
            ></Box>
            <Icon
              type={active ? 'filled' : icon.type}
              icon={icon.icon}
              size="medium"
              color="blue600"
              className={styles.icon}
            />
          </Box>
        ) : null}
        {!collapsed ? <Box className={styles.text}>{children}</Box> : ''}
      </Box>
      {showChevron && (
        <Icon
          type="filled"
          icon={chevron}
          size="medium"
          color="blue600"
          className={styles.icon}
        />
      )}
      {showLock && (
        <Icon
          type="filled"
          icon="lockClosed"
          size="small"
          color="blue600"
          className={styles.lock}
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
    <Link to={props.path}>
      <NavItemContent {...props} />
    </Link>
  ) : (
    <NavItemContent {...props} />
  )
}

export default NavItem
