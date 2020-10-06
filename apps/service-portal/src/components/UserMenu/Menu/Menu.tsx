import React, { FC } from 'react'
import cn from 'classnames'
import * as styles from './Menu.treat'
import { Box, Typography, Button, Stack, Icon } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import useAuth from '../../../hooks/useAuth/useAuth'
import { User } from 'oidc-client'
import NavItem from '../../Sidebar/NavItem/NavItem'
import { useLocale } from '@island.is/localization'

interface Props {
  isOpen: boolean
  userInfo: User
  onCloseMenu: () => void
}

export const Menu: FC<Props> = ({ isOpen, userInfo, onCloseMenu }) => {
  const { signOutUser } = useAuth()
  const { formatMessage } = useLocale()
  const handleLogoutClick = () => signOutUser()

  return (
    <>
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        left={0}
        className={cn(styles.overlay, {
          [styles.overlayIsOpen]: isOpen,
        })}
        onClick={onCloseMenu}
      />
      <Box
        width="full"
        background="white"
        paddingX={3}
        borderRadius="large"
        className={cn(styles.menu, {
          [styles.isOpen]: isOpen,
        })}
      >
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
          <Box className={styles.closeButton} padding={1} onClick={onCloseMenu}>
            <Icon type="close" color="blue400" width={10} height={10} />
          </Box>
        </Box>
        <Box padding={3} background="blue100">
          <Stack space={1}>
            <NavItem
              path={ServicePortalPath.MinarUpplysingar}
              onClick={onCloseMenu}
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
              onClick={onCloseMenu}
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
              onClick={onCloseMenu}
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
      </Box>
    </>
  )
}

export default Menu
