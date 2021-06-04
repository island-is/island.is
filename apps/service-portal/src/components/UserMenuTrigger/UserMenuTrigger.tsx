import React, { FC, useRef } from 'react'
import { Box, Button, Hidden } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'

import { useStore } from '../../store/stateProvider'
import { ActionType, MenuState } from '../../store/actions'
import UserMenu from '../UserMenu/UserMenu'

const UserMenuTrigger: FC<{}> = () => {
  const ref = useRef<HTMLElement>(null)
  const [{ userMenuState }, dispatch] = useStore()

  const setMenuState = (state: MenuState) => {
    dispatch({
      type: ActionType.SetUserMenuState,
      payload: state,
    })
  }

  const closeMenus = () => {
    setMenuState('closed')
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })
  }

  const handleClick = () =>
    setMenuState(userMenuState === 'open' ? 'closed' : 'open')

  const { userInfo } = useAuth()

  return (
    <Box display="flex" position="relative" height="full" ref={ref}>
      <Hidden below="md">
        <Button variant="utility" onClick={handleClick} icon="chevronDown">
          {userInfo?.profile.name}
        </Button>
      </Hidden>

      <Hidden above="sm">
        <Button
          variant="utility"
          onClick={() => {
            setMenuState('open')
          }}
          icon="person"
          iconType="outline"
        />
      </Hidden>

      {userInfo && (
        <UserMenu
          state={userMenuState}
          onClose={() => {
            setMenuState('closed')
          }}
          onRouteChange={() => {
            closeMenus()
          }}
        />
      )}
    </Box>
  )
}

export default UserMenuTrigger
