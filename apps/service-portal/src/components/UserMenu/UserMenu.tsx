import React, { FC, useState, useRef } from 'react'
import { useStore } from '../../store/stateProvider'
import { Box, Button, Hidden, Stack, Text } from '@island.is/island-ui/core'
import {
  getNameAbbreviation,
  Menu,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import useAuth from '../../hooks/useAuth/useAuth'
import * as styles from './UserMenu.treat'
import NavItem from '../Sidebar/NavItem/NavItem'
import { useLocale, useNamespaces } from '@island.is/localization'
import { MenuState } from '../../store/actions'

interface Props {
  state: MenuState
  onClose: () => void
  onRouteChange: () => void
}

const UserMenu: FC<Props> = ({ state, onClose, onRouteChange }) => {
  const { formatMessage } = useLocale()
  useNamespaces(['sp.settings', 'sp.messages'])
  const [{ userInfo }] = useStore()
  const { signOutUser } = useAuth()
  const handleLogoutClick = () => signOutUser()

  return (
    <Box position="relative">
      <Menu isOpen={state === 'open'} onCloseMenu={onClose}>
        <Box className={styles.menu}>
          <Box display="flex" alignItems="center" marginBottom={3}>
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
          <Box padding={3} background="blue100">
            <Stack space={1}>
              <NavItem
                path={ServicePortalPath.MyInfoRoot}
                onClick={onRouteChange}
                icon={{
                  type: 'outline',
                  icon: 'person',
                }}
                active={false}
              >
                {formatMessage({
                  id: 'service.portal:my-info',
                  defaultMessage: 'Mín gögn',
                })}
              </NavItem>
              <NavItem
                path={ServicePortalPath.SettingsRoot}
                onClick={onRouteChange}
                icon={{
                  type: 'outline',
                  icon: 'settings',
                }}
                active={false}
              >
                {formatMessage({
                  id: 'service.portal:settings',
                  defaultMessage: 'Stillingar',
                })}
              </NavItem>
            </Stack>
          </Box>
          <Box marginTop={6}>
            <Button onClick={handleLogoutClick} fluid>
              {formatMessage({
                id: 'global:logout',
                defaultMessage: 'Útskráning',
              })}
            </Button>
          </Box>
        </Box>
      </Menu>
    </Box>
  )
}

export default UserMenu
