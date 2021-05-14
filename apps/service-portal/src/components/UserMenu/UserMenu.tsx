import React, { FC } from 'react'
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
import { useAuth } from '@island.is/auth/react'
import * as styles from './UserMenu.treat'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { MenuState } from '../../store/actions'
import { ValueType } from 'react-select'
import { useUserProfile } from '@island.is/service-portal/graphql'
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
  const { userInfo, signOut } = useAuth()
  const { data: userProfile } = useUserProfile()
  const handleLogoutClick = () => signOut()

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
            <Select
              name="language-switcher"
              size="sm"
              value={
                lang === 'en'
                  ? { label: 'English', value: 'en' }
                  : { label: 'Íslenska', value: 'is' }
              }
              onChange={handleLanguageChange}
              label={formatMessage({
                id: 'service.portal:language',
                defaultMessage: 'Tungumál',
              })}
              options={[
                { label: 'Íslenska', value: 'is' },
                { label: 'English', value: 'en' },
              ]}
            />
            <Box>
              <Box
                display="flex"
                alignItems="center"
                marginBottom={1}
                className={styles.breakWord}
              >
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Icon type="outline" icon="mail" color="blue300" />
                </Box>
                <Text>{userProfile?.email || ''}</Text>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                marginBottom={2}
                className={styles.breakWord}
              >
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Icon type="outline" icon="call" color="blue300" />
                </Box>
                <Text>{userProfile?.mobilePhoneNumber || ''}</Text>
              </Box>
              <Link
                to={ServicePortalPath.UserProfileRoot}
                onClick={onRouteChange}
              >
                <Button variant="text" icon="arrowForward" size="small">
                  {formatMessage({
                    id: 'global:edit',
                    defaultMessage: 'Breyta',
                  })}
                </Button>
              </Link>
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
