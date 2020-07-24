import React, { FC } from 'react'
import * as styles from './NotificationSidebar.treat'
import cn from 'classnames'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/stateProvider'
import { Box, Typography } from '@island.is/island-ui/core'
import { notifications } from './mockNotifications'
import NotificationCard from './NotificationCard/NotificationCard'

const NotificationSidebar: FC<{}> = () => {
  const [{ notificationSidebarState }] = useStore()

  return (
    <div
      className={cn(styles.wrapper, {
        [styles.active]: notificationSidebarState === 'open',
      })}
    >
      {notifications.sections.map((section, index) => (
        <div key={index}>
          <Box textAlign="right" padding={2}>
            <Typography variant="pSmall" as="span" color="purple400">
              Í dag
            </Typography>
          </Box>
          {section.cards.map((card) => (
            <NotificationCard key={card.id} card={card} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default NotificationSidebar
