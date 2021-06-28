import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ValueType } from 'react-select'

import {
  Box,
  Button,
  Icon,
  Option,
  Text,
  UserDropdown,
} from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useAuth } from '@island.is/auth/react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { Features, useFeatureFlag } from '@island.is/feature-flags'

import { MenuState } from '../../store/actions'
import * as styles from './UserMenu.treat'
import { UserDelegations } from '../UserDelegations/UserDelegations'

interface UserMenuProps {
  state: MenuState
  onClose: () => void
  onRouteChange: () => void
}

const UserMenu = ({ state, onClose, onRouteChange }: UserMenuProps) => {
  const { lang, formatMessage } = useLocale()
  const { changeLanguage } = useNamespaces([
    'sp.settings',
    'sp.messages',
    'global',
  ])
  const { userInfo, signOut } = useAuth()
  const { data: userProfile } = useUserProfile()
  const showDelegations = useFeatureFlag(Features.delegationsEnabled, false)
  const handleLanguageChange = (option: ValueType<Option>) =>
    changeLanguage((option as Option).value.toString() as Locale)

  return (
    <UserDropdown
      username={userInfo?.profile.name}
      language={lang}
      dropdownState={state}
      setDropdownState={onClose}
      onLogout={() => {
        onClose()
        signOut()
      }}
      dropdownItems={
        <>
          <Box>
            {userProfile?.email && (
              <Box
                display="flex"
                alignItems="center"
                marginBottom={1}
                className={styles.breakWord}
              >
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Icon type="outline" icon="mail" color="blue300" />
                </Box>

                <Text>{userProfile.email}</Text>
              </Box>
            )}
            {userProfile?.mobilePhoneNumber && (
              <Box
                display="flex"
                alignItems="center"
                marginBottom={2}
                className={styles.breakWord}
              >
                <Box display="flex" alignItems="center" marginRight={2}>
                  <Icon type="outline" icon="call" color="blue300" />
                </Box>

                <Text>{userProfile.mobilePhoneNumber}</Text>
              </Box>
            )}

            <Link to={ServicePortalPath.SettingsRoot} onClick={onRouteChange}>
              <Button variant="text" icon="arrowForward" size="small">
                {formatMessage({
                  id: 'sp.settings:edit',
                  defaultMessage: 'Breyta stillingum',
                })}
              </Button>
            </Link>
          </Box>
          {showDelegations.value && <UserDelegations onSwitch={onClose} />}
        </>
      }
      switchLanguage={handleLanguageChange}
    />
  )
}

export default UserMenu
