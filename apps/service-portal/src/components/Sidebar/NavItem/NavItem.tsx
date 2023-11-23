import { Box, IconProps, Icon } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import * as styles from './NavItem.css'
import { Link } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { ProjectBasePath } from '@island.is/shared/constants'
import cn from 'classnames'
import Chevron from './Chevron'
import { iconTypeToSVG, iconIdMapper } from '../../../utils/Icons/idMapper'

interface Props {
  path?: string
  icon?: Pick<IconProps, 'icon' | 'type'>
  active: boolean
  chevron?: boolean
  hover?: boolean
  enabled?: boolean
  expanded?: boolean
  external?: boolean
  hasArray?: boolean
  badge?: boolean
  variant?: 'blue' | 'blueberry'
  onClick?: () => void
  onChevronClick?: () => void
}

const NavItemContent: FC<React.PropsWithChildren<Props>> = ({
  icon,
  active,
  enabled,
  hasArray,
  onClick,
  children,
  badge = false,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const showLock = enabled === false
  const pathName = window.location.pathname
  const isDashboard = pathName === ProjectBasePath.ServicePortal

  const navItemActive: keyof typeof styles.navItemActive = active
    ? 'active'
    : 'inactive'

  const badgeActive: keyof typeof styles.badge = badge ? 'active' : 'inactive'

  const animatedIconSource = icon
    ? `./assets/icons/sidebar/${icon.icon}.svg`
    : undefined

  const iconSvg = icon ? iconTypeToSVG(icon.icon ?? '', 'navid') : undefined

  return (
    <Box
      className={[
        styles.navItem,
        styles.navItemActive[navItemActive],
        'navitem',
        isDashboard && styles.dashboard,
      ]}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      cursor={showLock ? undefined : 'pointer'}
      position="relative"
      onClick={() => {
        const id = icon && iconIdMapper(icon.icon)
        const a: HTMLElement | null = id ? document.getElementById(id) : null
        a && a.dispatchEvent(new Event('click'))
        if (!hasArray && onClick) onClick()
      }}
      paddingY={1}
      paddingLeft={3}
      paddingRight={2}
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
            justifyContent={isDashboard ? 'center' : 'spaceBetween'}
            marginRight={1}
            className={animatedIconSource && styles.animatedIcon}
          >
            <Box
              borderRadius="circle"
              className={cn(styles.badge[badgeActive])}
            ></Box>

            {!isDashboard && !isMobile && !!iconSvg ? (
              <Box
                className={styles.animatedIcon}
                display="flex"
                justifyContent="center"
              >
                {iconSvg}
              </Box>
            ) : (
              <Box
                className={styles.animatedIcon}
                display="flex"
                justifyContent="center"
              >
                <Icon type={'outline'} icon={icon.icon} />
              </Box>
            )}
          </Box>
        ) : null}
        <Box className={styles.text}>{children}</Box>
      </Box>
      {showLock && (
        <Icon
          type="filled"
          icon="lockClosed"
          size="small"
          color={active ? 'blue400' : 'blue600'}
          className={styles.lock}
        />
      )}
    </Box>
  )
}

const NavItem: FC<React.PropsWithChildren<Props>> = (props) => {
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
