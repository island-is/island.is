import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

interface UserDropdownProps {
  user: User
  dropdownState: 'open' | 'closed'
  setDropdownState: Dispatch<SetStateAction<'closed' | 'open'>>
  onLogout?: () => void
  onSwitchUser: (nationalId: string) => void
  fullscreen: boolean
  showDropdownLanguage: boolean
}

export const UserDropdown = ({
  user,
  dropdownState,
  setDropdownState,
  onSwitchUser,
  onLogout,
  fullscreen,
  showDropdownLanguage,
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
  const isDelegationCompany = user.profile.subjectType === 'legalEntity'

  const { value: showPersonalInfo } = useFeatureFlag(
    Features.personalInformation,
    false,
  )

  const showDelegations =
    useFeatureFlag(Features.delegationsEnabled, false).value || Boolean(actor)

  const { data, error, loading } = useActorDelegationsQuery({
    skip: !showDelegations,
    errorPolicy: 'all', // Return partial data, ignoring failed national registry lookups.
  })
  const hasDelegationsData = data && data.authActorDelegations?.length > 0
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const closeButton = (
    <button
      className={styles.closeButton}
      onClick={() => setDropdownState('closed')}
      aria-label={formatMessage(sharedMessages.close)}
    >
      <Icon icon="close" color="blue400" />
    </button>
  )

  const content = (
    <Box display="flex" justifyContent="flexEnd">
      <Box
        position="relative"
        background="white"
        padding={3}
        borderRadius="large"
        display="flex"
        flexDirection="column"
        height={isMobile ? 'full' : undefined}
        className={cn(
          fullscreen ? styles.fullScreen : styles.dropdown,
          styles.container,
        )}
      >
        <Box display="flex" flexDirection="column" className={styles.wrapper}>
          {/* Current User */}
          <Box
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
            paddingBottom={3}
          >
            {/* Check if actor is company - display company icon
             * kennitala function is buggy - temp removal
             */}
            {/* {isDelegationCompany ? (
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
                <UserAvatar username={isDelegation ? actorName : userName} />
          )} */}
            <UserAvatar username={isDelegation ? actorName : userName} />

            <Box marginLeft={1} marginRight={4}>
              <Text variant="h4" as="h4">
                {userName}
              </Text>
              {isDelegation && <Text variant="small">{actorName}</Text>}
            </Box>
          </Box>
          {/* <Divider /> */}
          {showDropdownLanguage && (
            <Hidden above="sm">
              {<UserLanguageSwitcher user={user} dropdown />}
            </Hidden>
          )}

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
          {(!isDelegation || isDelegationCompany) &&
            (showPersonalInfo || showDelegations) && (
              <>
                <UserProfileInfo
                  isCompany={isDelegationCompany}
                  onClick={() => onClose()}
                />
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
        <Hidden below="md">{closeButton}</Hidden>
      </Box>
    </Box>
  )
  return isMobile ? (
    <Box display={isVisible ? 'flex' : 'none'} height="full">
      {content}
    </Box>
  ) : (
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
      <GridContainer>{content}</GridContainer>
    </ModalBase>
  )
}
