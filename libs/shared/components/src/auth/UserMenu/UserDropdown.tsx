import React, { Dispatch, SetStateAction } from 'react'
import {
  Box,
  Text,
  ModalBase,
  UserAvatar,
  Icon,
  GridContainer,
  Divider,
  Hidden,
} from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { sharedMessages, userMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import * as styles from './UserMenu.css'
import { UserDelegations } from './UserDelegations'
import { UserDropdownItem } from './UserDropdownItem'
import { UserProfileInfo } from './UserProfileInfo'
import * as kennitala from 'kennitala'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useActorDelegationsQuery } from '../../../gen/graphql'
import { QueryResult } from '@apollo/client'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'
import cn from 'classnames'

interface UserDropdownProps {
  user: User
  dropdownState: 'open' | 'closed'
  setDropdownState: Dispatch<SetStateAction<'closed' | 'open'>>
  onLogout?: () => void
  onSwitchUser: (nationalId: string) => void
  fullscreen: boolean
}

export const UserDropdown = ({
  user,
  dropdownState,
  setDropdownState,
  onSwitchUser,
  onLogout,
  fullscreen,
}: UserDropdownProps) => {
  const { formatMessage } = useLocale()
  const isVisible = dropdownState === 'open'
  const onClose = () => {
    setDropdownState('closed')
  }

  const actor = user.profile.actor
  const isDelegation = Boolean(actor)
  const userName = user.profile.name
  const actorName = actor?.name
  const isCompany = kennitala.isCompany(user.profile.nationalId)

  const { value: showPersonalInfo } = useFeatureFlag(
    'isServicePortalPersonalInformationModuleEnabled',
    false,
  )

  const showDelegations =
    useFeatureFlag(Features.delegationsEnabled, false).value || Boolean(actor)
  const { data, error, loading } = useActorDelegationsQuery({
    skip: !showDelegations,
  })
  const hasDelegationsData = data && data.authActorDelegations?.length > 0

  return (
    <ModalBase
      baseId="island-ui-header-user-dropdown"
      isVisible={isVisible}
      hideOnClickOutside={true}
      hideOnEsc={true}
      modalLabel={formatMessage(userMessages.userButtonAria)}
      removeOnClose={true}
      preventBodyScroll={true}
      onVisibilityChange={(visibility: boolean) => {
        if (visibility !== isVisible) {
          onClose()
        }
      }}
    >
      <GridContainer>
        <Box display="flex" justifyContent="flexEnd">
          <Box
            position="relative"
            background="white"
            padding={3}
            borderRadius="large"
            display="flex"
            flexDirection="column"
            className={cn(
              fullscreen ? styles.fullScreen : styles.dropdown,
              styles.container,
            )}
          >
            <Box
              display="flex"
              flexDirection="column"
              className={styles.wrapper}
            >
              {/* Current User */}
              <Box
                display="flex"
                flexWrap="nowrap"
                alignItems="center"
                paddingBottom={3}
              >
                {/* Start of current User */}
                {/* Check if actor is company - display company icon */}
                {isCompany ? (
                  <Box
                    borderRadius="circle"
                    background="blue100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className={styles.companyIconSize}
                  >
                    <Icon icon="business" type="filled" color="blue400" />
                  </Box>
                ) : (
                  <UserAvatar username={userName} />
                )}
                <Box marginLeft={1} marginRight={4}>
                  <Text variant="h4" as="h4">
                    {userName}
                  </Text>
                  {isDelegation && <Text variant="small">{actorName}</Text>}
                </Box>
              </Box>
              <Hidden above="sm">
                {<UserLanguageSwitcher user={user} dropdown />}
              </Hidden>

              <Divider />
              {/* End of current User */}
              {/* User delegations */}
              {hasDelegationsData && (
                <UserDelegations
                  user={user}
                  onSwitchUser={onSwitchUser}
                  data={{ data, error, loading } as QueryResult}
                />
              )}
              {/* End of user delegations */}
              {/* User settings */}
              {!isDelegation && showPersonalInfo && (
                <>
                  <UserProfileInfo onClick={() => onClose()} />
                  <Divider />
                </>
              )}
              {/* End of user settings */}

              {/* Logout */}
              <Box paddingTop={[1, 2]}>
                <UserDropdownItem
                  text={formatMessage(sharedMessages.logout)}
                  icon={{ type: 'outline', icon: 'logOut' }}
                  onClick={onLogout}
                />
              </Box>
              {/* End of Logout */}
            </Box>
            <button
              className={styles.closeButton}
              onClick={() => setDropdownState('closed')}
              aria-label={formatMessage(sharedMessages.close)}
            >
              <Icon icon="close" color="blue400" />
            </button>
          </Box>
        </Box>
      </GridContainer>
    </ModalBase>
  )
}
