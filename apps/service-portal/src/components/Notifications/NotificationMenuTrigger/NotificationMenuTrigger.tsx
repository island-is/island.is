import React, { FC, useRef } from 'react'
import { Button, Box } from '@island.is/island-ui/core'
import { useStore } from '../../../store/stateProvider'
import { ActionType, MenuState } from '../../../store/actions'
import NotificationMenu from '../NotificationMenu/NotificationMenu'
import { useClickAway } from 'react-use'

const NotificationMenuTrigger: FC<{}> = () => {
  const ref = useRef<HTMLElement>(null)
  const [{ notificationMenuState }, dispatch] = useStore()

  const setMenuState = (state: MenuState) =>
    dispatch({
      type: ActionType.SetNotificationMenuState,
      payload: state,
    })

  const handleClick = () =>
    setMenuState(notificationMenuState === 'open' ? 'closed' : 'open')

  useClickAway(ref, () =>
    notificationMenuState === 'open' ? setMenuState('closed') : null,
  )

  return (
    <Box position="relative" display="flex" height="full" ref={ref}>
      <Button
        variant="utility"
        onClick={handleClick}
        icon="lockClosed"
        iconType="outline"
      />
      <NotificationMenu
        state={notificationMenuState}
        onClose={setMenuState.bind(null, 'closed')}
      />
    </Box>
  )
}

export default NotificationMenuTrigger
