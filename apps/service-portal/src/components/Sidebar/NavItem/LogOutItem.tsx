import React, { useState } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import * as styles from './NavItem.css'
import { useStore } from '../../../store/stateProvider'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'

interface Props {
  onClick?: () => void
}

const LogOutItem = ({ onClick }: Props) => {
  const { formatMessage } = useLocale()
  const [{ sidebarState }] = useStore()
  const [hover, setHover] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const collapsed = sidebarState === 'closed' && !isMobile
  let navItemHover: keyof typeof styles.navItemHover = 'none'

  const navItemActive: keyof typeof styles.navItemActive = collapsed
    ? 'inactiveCollapsed'
    : 'inactive'

  if (hover && collapsed) {
    navItemHover = 'hoverCollapsed'
  } else if (hover) {
    navItemHover = 'hoverInactive'
  } else {
    navItemHover = 'none'
  }

  return (
    <Box
      position="relative"
      onMouseOver={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      <Box
        className={[
          styles.navItemHover[navItemHover],
          styles.navItemActive[navItemActive],
        ]}
        display="flex"
        alignItems="center"
        justifyContent={collapsed ? 'center' : 'spaceBetween'}
        cursor="pointer"
        position="relative"
        onClick={onClick}
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent={collapsed ? 'center' : 'flexStart'}
            marginRight={collapsed ? 0 : 1}
          >
            <Icon
              type="outline"
              icon="logOut"
              color={hover ? 'blue400' : 'blue600'}
              size="medium"
              className={styles.icon}
            />
          </Box>

          {!collapsed ? (
            <Box className={styles.text}>
              {formatMessage(sharedMessages.logout)}
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default LogOutItem
