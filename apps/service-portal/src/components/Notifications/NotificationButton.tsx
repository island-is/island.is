import React, { useRef } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { m } from '@island.is/service-portal/core'
import NotificationMenu from './NotificationMenu'
import { MenuTypes } from '../Header/Header'

interface Props {
  setMenuState: (val: MenuTypes) => void
  showMenu?: boolean
}

const NotificationButton = ({ setMenuState, showMenu = false }: Props) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <Box marginRight={[1, 1, 2]}>
      <Button
        variant="utility"
        colorScheme="white"
        icon={showMenu && isMobile ? 'close' : 'notifications'}
        iconType="outline"
        onClick={() => {
          showMenu && isMobile
            ? setMenuState(undefined)
            : setMenuState('notifications')
        }}
        ref={ref}
        aria-label={formatMessage(m.notifications)}
      />
      <NotificationMenu
        closeNotificationMenu={() => setMenuState(undefined)}
        sideMenuOpen={showMenu}
        rightPosition={ref.current?.getBoundingClientRect().right}
      />
    </Box>
  )
}

export default NotificationButton
