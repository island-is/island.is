import React, { FC } from 'react'
import { Box, Button, Stack, Text } from '@island.is/island-ui/core'

import { useStore } from '../../store/stateProvider'
import useAuth from '../../hooks/useAuth/useAuth'
import { MenuState } from '../../store/actions'
import Menu from '../Menu/Menu'

import * as styles from './UserMenu.treat'
interface Props {
  state: MenuState
  onClose: () => void
  onRouteChange: () => void
}

export const getNameAbbreviation = (name: string) => {
  const names = name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1)
    initials += names[names.length - 1].substring(0, 1).toUpperCase()

  return initials
}

const UserMenu: FC<Props> = ({ state, onClose, onRouteChange }) => {
  const [{ userInfo }] = useStore()
  const { signOutUser } = useAuth()
  const handleLogoutClick = () => signOutUser()

  return (
    <Box position="relative">
      <Menu isOpen={state === 'open'} onCloseMenu={onClose}>
        <Box className={styles.menu}>
          <Stack space={4}>
            <Box display="flex" alignItems="center">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                background="blue100"
                borderRadius="circle"
                marginRight={3}
                className={styles.avatar}
              >
                <Text variant="h3" as="h3" color="blue400">
                  {getNameAbbreviation(userInfo?.profile.name || '')}
                </Text>
              </Box>
              <Box marginRight={4}>
                <Text variant="h4" as="h4">
                  {userInfo?.profile.name}
                </Text>
              </Box>
            </Box>
            <Box>
              <Button
                onClick={handleLogoutClick}
                fluid
                icon="logOut"
                iconType="outline"
              >
                Útskrá
              </Button>
            </Box>
          </Stack>
        </Box>
      </Menu>
    </Box>
  )
}

export default UserMenu
