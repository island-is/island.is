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
        <Menu isOpen={isOpen} onCloseMenu={setIsOpen.bind(null, false)}>
          <Box display="flex" alignItems="center" paddingY={3}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              background="blue200"
              className={styles.avatar}
            >
              <Icon type="user" width={30} height={30} />
            </Box>
            <Typography variant="h4">{userInfo?.profile.name}</Typography>
          </Box>
          <Box padding={3} background="blue100">
            <Stack space={1}>
              <NavItem
                path={ServicePortalPath.MinarUpplysingar}
                onClick={setIsOpen.bind(null, false)}
                icon="user"
                active={false}
                variant="blue"
              >
                {formatMessage({
                  id: 'service.portal:my-info',
                  defaultMessage: 'Mínar upplýsingar',
                })}
              </NavItem>
              <NavItem
                path={ServicePortalPath.StillingarRoot}
                onClick={setIsOpen.bind(null, false)}
                icon="globe"
                active={false}
                variant="blue"
              >
                {formatMessage({
                  id: 'service.portal:settings',
                  defaultMessage: 'Stillingar',
                })}
              </NavItem>
              <NavItem
                path={ServicePortalPath.StillingarUmbod}
                onClick={setIsOpen.bind(null, false)}
                icon="lock"
                active={false}
                variant="blue"
              >
                {formatMessage({
                  id: 'service.portal:delegation',
                  defaultMessage: 'Umboð',
                })}
              </NavItem>
            </Stack>
          </Box>
          <Box marginY={3}>
            <Button width="fluid" onClick={handleLogoutClick}>
              {formatMessage({
                id: 'global:logout',
                defaultMessage: 'Útskráning',
              })}
            </Button>
          </Box>
        </Menu>
      )}
    </Box>
  )
}

export default UserMenu
