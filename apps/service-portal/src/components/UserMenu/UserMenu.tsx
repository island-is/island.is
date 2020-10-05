import React, { FC, useState, useRef } from 'react'
import { useStore } from '../../store/stateProvider'
import { Box, Button, Hidden, Icon } from '@island.is/island-ui/core'
import Menu from './Menu/Menu'
import { useClickAway } from 'react-use'

const UserMenu: FC<{}> = () => {
  const ref = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [{ userInfo }] = useStore()

  useClickAway(ref, () => (isOpen ? setIsOpen(false) : null))

  return (
    <Box position="relative" height="full" ref={ref}>
      <Hidden below="md">
        <Button
          variant="menu"
          width="fluid"
          href=""
          onClick={setIsOpen.bind(null, !isOpen)}
          leftIcon="user"
          icon="cheveron"
        >
          {userInfo?.profile.name}
        </Button>
      </Hidden>
      <Hidden above="sm">
        <Button
          variant="menu"
          onClick={setIsOpen.bind(null, !isOpen)}
          size="small"
          icon="user"
        />
      </Hidden>
      {userInfo && (
        <Menu
          isOpen={isOpen}
          userInfo={userInfo}
          onCloseMenu={setIsOpen.bind(null, false)}
        />
      )}
    </Box>
  )
}

export default UserMenu
