import React, { FC } from 'react'
import * as styles from './NotificationMenuTrigger.treat'
import { Button, Box, Icon } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/store/stateProvider'
import { ActionType } from '../../../store/actions'

const NotificationMenuTrigger: FC<{}> = () => {
  const [{ notificationSidebarState }, dispatch] = useStore()

  const handleClick = () =>
    dispatch({
      type: ActionType.SetNotificationSidebarState,
      payload: notificationSidebarState === 'open' ? 'closed' : 'open',
    })

  return (
    <Box position="relative">
      <span className={styles.notificationCount}>5</span>
      <Button variant="menu" onClick={handleClick} size="small">
        <Icon type="lock" width={22} height={24} />
      </Button>
    </Box>
  )
}

export default NotificationMenuTrigger
