import React, { FC } from 'react'
import { useStore } from '../../store/stateProvider'
import {
  Box,
  Button,
  Icon,
  Option,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  getNameAbbreviation,
  Menu,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import useAuth from '../../hooks/useAuth/useAuth'
import * as styles from './UserMenu.treat'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { MenuState } from '../../store/actions'
import { ValueType } from 'react-select'
import { Link } from 'react-router-dom'

interface Props {
  state: MenuState
  onClose: () => void
  onRouteChange: () => void
}

const UserMenu: FC<Props> = ({ state, onClose, onRouteChange }) => {
  const { lang, formatMessage } = useLocale()
  const { changeLanguage } = useNamespaces([
    'sp.settings',
    'sp.messages',
    'global',
  ])
  const [{ userInfo }] = useStore()
  const { signOutUser } = useAuth()
  const handleLogoutClick = () => signOutUser()

  const handleLanguageChange = (option: ValueType<Option>) =>
    changeLanguage((option as Option).value.toString() as Locale)

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
                {formatMessage({
                  id: 'global:logout',
                  defaultMessage: 'Útskrá',
                })}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Menu>
    </Box>
  )
}

export default UserMenu
