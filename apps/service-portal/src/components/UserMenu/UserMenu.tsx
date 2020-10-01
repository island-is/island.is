import React, { FC, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'
import { Box, Button, Hidden, Icon } from '@island.is/island-ui/core'
import Menu from './Menu/Menu'
import { useClickAway } from 'react-use'

const UserMenu: FC<{}> = () => {
  const ref = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const history = useHistory()
  const [{ userInfo }] = useStore()

  useClickAway(ref, () => (isOpen ? setIsOpen(false) : null))

  const handleSelection = async (subjectNationalId: string) => {
    setIsOpen(false)
    history.push('/')
  }

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
        >
          <Icon type="user" width={22} height={24} />
        </Button>
      </Hidden>
      {userInfo && (
        <Menu
          isOpen={isOpen}
          userInfo={userInfo}
          onSubjectSelection={handleSelection}
          onCloseMenu={setIsOpen.bind(null, false)}
        />
      )}
    </Box>
  )
}

export default UserMenu
