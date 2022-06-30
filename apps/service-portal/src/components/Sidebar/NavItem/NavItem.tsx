import { Box, IconProps, Icon } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import * as styles from './NavItem.css'
import { Link } from 'react-router-dom'
import { useStore } from '../../../store/stateProvider'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'

interface ChevronProps {
  expanded?: boolean
  enabled?: boolean
  active: boolean
  onChevronClick?: () => void
}

interface Props {
  path?: ServicePortalPath
  icon?: Pick<IconProps, 'icon' | 'type'>
  active: boolean
  chevron?: boolean
  hover: boolean
  enabled?: boolean
  expanded?: boolean
  external?: boolean
  variant?: 'blue' | 'blueberry'
  hasArray?: boolean
  onClick?: () => void
  onChevronClick?: () => void
  badge?: boolean
}

const NavItemContent: FC<Props> = ({
  icon,
  active,
  hover,
  enabled,
  hasArray,
  onClick,
  children,
  badge = false,
}) => {
  const [{ sidebarState }] = useStore()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const collapsed = sidebarState === 'closed' && !isMobile
  const showLock = enabled === false

  const navItemActive: keyof typeof styles.navItemActive = active
    ? collapsed
      ? 'activeCollapsed'
      : 'active'
    : collapsed
    ? 'inactiveCollapsed'
    : 'inactive'

  let navItemHover: keyof typeof styles.navItemHover = 'none'

  if (hover && active) {
    navItemHover = 'hoverActive'
  } else if (hover && collapsed) {
    navItemHover = 'hoverCollapsed'
  } else if (hover && !active) {
    navItemHover = 'hoverInactive'
  } else {
    navItemHover = 'none'
  }
  const badgeActive: keyof typeof styles.badge = badge ? 'active' : 'inactive'

  return (
    <Box
      className={[
        styles.navItemHover[navItemHover],
        styles.navItemActive[navItemActive],
      ]}
      display="flex"
      alignItems="center"
      justifyContent={collapsed ? 'center' : 'spaceBetween'}
      cursor={showLock ? undefined : 'pointer'}
      position="relative"
      onClick={showLock ? (hasArray ? undefined : onClick) : onClick}
      paddingY={1}
      paddingLeft={collapsed ? 1 : 3}
      paddingRight={collapsed ? 1 : 2}
    >
      <Box
        display="flex"
        height="full"
        alignItems="center"
        overflow="hidden"
        paddingX={[3, 3, 0]}
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
              className={cn(
                styles.badge[badgeActive],
                collapsed && styles.badgeCollapsed,
              )}
            ></Box>
            <Icon
              type={active ? 'filled' : 'outline'}
              icon={icon.icon}
              color={active || hover ? 'blue400' : 'blue600'}
              size="medium"
              className={styles.icon}
            />
          </Box>
        ) : null}
        {!collapsed ? <Box className={styles.text}>{children}</Box> : ''}
      </Box>
      {showLock && (
        <Icon
          type="filled"
          icon="lockClosed"
          size="small"
          color={hover || active ? 'blue400' : 'blue600'}
          className={cn(styles.lock, collapsed && styles.lockCollapsed)}
        />
      )}
    </Box>
  )
}

const Chevron: FC<ChevronProps> = ({
  expanded,
  enabled,
  active,
  onChevronClick,
}) => {
  const chevronIcon = expanded ? 'chevronUp' : 'chevronDown'
  const [{ sidebarState }] = useStore()
  const showChevron = enabled && sidebarState === 'open'

  return showChevron ? (
    <Box
      onClick={() => {
        onChevronClick && onChevronClick()
      }}
      className={styles.iconWrapper}
    >
      <Icon
        type="filled"
        icon={chevronIcon}
        size="medium"
        color={active ? 'blue400' : 'blue600'}
        className={styles.icon}
      />
    </Box>
  ) : null
}

const NavItem: FC<Props> = (props) => {
  return props.external ? (
    <a
      href={props.path}
      target="_blank"
      rel="noreferrer noopener"
      className={styles.link}
    >
      <NavItemContent {...props} />
    </a>
  ) : props.path ? (
    props.hasArray ? (
      <Box display="inlineFlex" width="full">
        <Link to={props.path} className={styles.link}>
          <NavItemContent {...props} />
        </Link>
        <Chevron {...props} />
      </Box>
    ) : (
      <Link to={props.path} className={styles.link}>
        <NavItemContent {...props} />
      </Link>
    )
  ) : (
    <NavItemContent {...props} />
  )
}

export default NavItem
