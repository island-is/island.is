import React, { FC } from 'react'
import * as styles from './NotificationMenuTrigger.treat'
import { Icon, Box } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/store/stateProvider'
import cn from 'classnames'

const NotificationMenuTrigger: FC<{}> = () => {
  const [{ notificationSidebarState }, dispatch] = useStore()

  const handleClick = () =>
    dispatch({
      type: 'setNotificationSidebarState',
      payload: notificationSidebarState === 'open' ? 'closed' : 'open',
    })

  return (
    <button
      className={cn(styles.button, {
        [styles.buttonExpanded]: notificationSidebarState === 'open',
      })}
      onClick={handleClick}
    >
      <Box position="relative">
        <span className={styles.notificationCount}>5</span>
        <Icon type="info" />
      </Box>
      <span
        className={cn(styles.info, {
          [styles.infoActive]: notificationSidebarState === 'open',
        })}
      >
        <Box className={styles.infoTitle} marginLeft={2}>
          Skilaboð
        </Box>
        <Icon type="cheveron" width={10} height={12} />
      </span>
    </button>
  )
}

export default NotificationMenuTrigger
