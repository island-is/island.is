import React, { FC } from 'react'
import * as styles from './NotificationSidebar.treat'
import cn from 'classnames'
import { Box, Typography, Stack } from '@island.is/island-ui/core'
import { notifications } from './mockNotifications'
import NotificationCard from './NotificationCard/NotificationCard'
import { useStore } from '../../../store/stateProvider'

const NotificationSidebar: FC<{}> = () => {
  const [{ notificationSidebarState }] = useStore()

  return (
    <>
      <Box
        padding={4}
        boxShadow="large"
        background="white"
        className={cn(styles.wrapper, {
          [styles.active]: notificationSidebarState === 'open',
        })}
      >
        {notifications.sections.map((section, index) => (
          <Box marginBottom={3} key={index}>
            <Stack space={1}>
              <Box marginBottom={1} textAlign="right">
                <Typography variant="eyebrow" as="span" color="purple400">
                  Í dag
                </Typography>
              </Box>
              {section.cards.map((card) => (
                <NotificationCard key={card.id} card={card} />
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default NotificationSidebar
