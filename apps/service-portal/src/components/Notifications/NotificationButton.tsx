import React, { useRef } from 'react'
import cn from 'classnames'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { m } from '@island.is/service-portal/core'
import NotificationMenu from './NotificationMenu'
import { MenuTypes } from '../Header/Header'
import * as styles from './Notifications.css'
import { useGetUserNotificationsOverviewQuery } from '@island.is/service-portal/information'

interface Props {
  setMenuState: (val: MenuTypes) => void
  showMenu?: boolean
}

const NotificationButton = ({ setMenuState, showMenu = false }: Props) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const ref = useRef<HTMLButtonElement>(null)

  const { data } = useGetUserNotificationsOverviewQuery({
    variables: {
      input: {
        limit: 5,
      },
    },
  })

  const showBadge = !!data?.userNotificationsOverview?.unseenCount

  return (
    <Box position="relative" marginRight={[1, 1, 2]}>
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
      {data?.userNotificationsOverview?.data.length ? (
        <Box
          borderRadius="circle"
          className={cn({ [styles.badge]: showBadge })}
        />
      ) : undefined}
      <NotificationMenu
        closeNotificationMenu={() => setMenuState(undefined)}
        sideMenuOpen={showMenu}
        rightPosition={ref.current?.getBoundingClientRect().right}
        data={data}
      />
    </Box>
  )
}

export default NotificationButton
