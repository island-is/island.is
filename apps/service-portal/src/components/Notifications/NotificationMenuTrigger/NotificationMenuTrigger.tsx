import React, { FC, useRef } from 'react'
import * as styles from './NotificationMenuTrigger.treat'
import { Button, Box, Icon } from '@island.is/island-ui/core'
import { useStore } from '../../../store/stateProvider'
import { ActionType, NotificationMenuState } from '../../../store/actions'
import NotificationMenu from '../NotificationMenu/NotificationMenu'
import { useOutsideClick } from '@island.is/service-portal/core'

const NotificationMenuTrigger: FC<{}> = () => {
  const ref = useRef()
  const [{ notificationMenuState }, dispatch] = useStore()

  const setMenuState = (state: NotificationMenuState) =>
    dispatch({
      type: ActionType.SetNotificationMenuState,
      payload: state,
    })

  const handleClick = () =>
    setMenuState(notificationMenuState === 'open' ? 'closed' : 'open')
  useOutsideClick(ref, () => setMenuState('closed'))

  return (
    <Box position="relative" ref={ref}>
      <span className={styles.notificationCount}>5</span>
      <Button variant="menu" onClick={handleClick} size="small">
        <Icon type="lock" width={22} height={24} />
      </Button>
      <NotificationMenu state={notificationMenuState} />
    </Box>
  )
}

export default NotificationMenuTrigger
