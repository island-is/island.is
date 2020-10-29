import React, { FC, useState, useRef } from 'react'
import { useStore } from '../../store/stateProvider'
import {
  Box,
  Button,
  Hidden,
  Icon,
  Stack,
  Typography,
} from '@island.is/island-ui/core'
import { useClickAway } from 'react-use'
import { Menu, ServicePortalPath } from '@island.is/service-portal/core'
import useAuth from '../../hooks/useAuth/useAuth'
import { useLocale } from '@island.is/localization'
import * as styles from './UserMenu.treat'
import NavItem from '../Sidebar/NavItem/NavItem'

const UserMenu: FC<{}> = () => {
  const ref = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [{ userInfo }] = useStore()
  const { signOutUser } = useAuth()
  const { formatMessage } = useLocale()
  const handleLogoutClick = () => signOutUser()

  useClickAway(ref, () => (isOpen ? setIsOpen(false) : null))

  return (
    <Box display="flex" position="relative" height="full" ref={ref}>
      <Hidden below="md">
        <Button
          variant="utility"
          onClick={setIsOpen.bind(null, !isOpen)}
          icon="chevronDown"
        >
          {userInfo?.profile.name}
        </Button>
      </Hidden>
      <Hidden above="sm">
        <Button
          variant="utility"
          onClick={setIsOpen.bind(null, !isOpen)}
          icon="person"
          iconType="outline"
        />
      </Hidden>
      {userInfo && (
        <Box position="relative">
          <Menu isOpen={isOpen} onCloseMenu={setIsOpen.bind(null, false)}>
            <Box className={styles.menu}>
              <Box display="flex" alignItems="center" marginBottom={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  background="blue200"
                  className={styles.avatar}
                >
                  <Icon type="outline" icon="person" size="large" />
                </Box>
                <Box marginRight={4}>
                  <Typography variant="h4">{userInfo?.profile.name}</Typography>
                </Box>
              </Box>
              <Box padding={3} background="blue100">
                <Stack space={1}>
                  <NavItem
                    path={ServicePortalPath.MinGognRoot}
                    onClick={setIsOpen.bind(null, false)}
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
                    path={ServicePortalPath.StillingarRoot}
                    onClick={setIsOpen.bind(null, false)}
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
              <Box marginTop={3}>
                <Button onClick={handleLogoutClick}>
                  {formatMessage({
                    id: 'global:logout',
                    defaultMessage: 'Útskráning',
                  })}
                </Button>
              </Box>
            </Box>
          </Menu>
        </Box>
      )}
    </Box>
  )
}

export default UserMenu
