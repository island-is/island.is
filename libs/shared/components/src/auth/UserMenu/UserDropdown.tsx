import React, { Dispatch, SetStateAction } from 'react'
import {
  Box,
  Stack,
  Text,
  ModalBase,
  UserAvatar,
  Icon,
  GridContainer,
  Divider,
  Option,
} from '@island.is/island-ui/core'
import { User, Locale } from '@island.is/shared/types'
import { sharedMessages, userMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import { useUpdateUserProfileMutation } from '../../../gen/graphql'
import * as styles from './UserMenu.css'
import { UserDelegations } from './UserDelegations'
import { UserDropdownItem } from './UserDropdownItem'
import { UserProfileInfo } from './UserProfileInfo'
import * as kennitala from 'kennitala'
import { ValueType } from 'react-select'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useActorDelegationsQuery } from '../../../gen/graphql'
import { QueryResult } from '@apollo/client'

interface UserDropdownProps {
  user: User
  dropdownState: 'open' | 'closed'
  setDropdownState: Dispatch<SetStateAction<'closed' | 'open'>>
  onLogout?: () => void
  onSwitchUser: (nationalId: string) => void
}

export const UserDropdown = ({
  user,
  dropdownState,
  setDropdownState,
  onSwitchUser,
  onLogout,
}: UserDropdownProps) => {
  const { lang, formatMessage, changeLanguage } = useLocale()
  const isVisible = dropdownState === 'open'
  const onClose = () => {
    setDropdownState('closed')
  }

  const [updateUserProfileMutation] = useUpdateUserProfileMutation()

  // const handleLanguageChange = async (option: ValueType<Option>) => {
  //   const locale = (option as Option).value.toString()
  //   changeLanguage(locale as Locale)

  //   if (user && !isDelegation) {
  //     try {
  //       await updateUserProfileMutation({
  //         variables: {
  //           input: {
  //             locale: locale,
  //           },
  //         },
  //       })
  //     } catch (e) {
  //       return null
  //     }
  //   }
  // }

  const actor = user.profile.actor
  const isDelegation = Boolean(actor)
  const userName = user.profile.name
  const actorName = actor?.name
  const isDelegationCompany = false

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
      preventBodyScroll={false}
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
            className={styles.fullScreen}
          >
            <Stack space={3}>
              {/* Current User */}
              <Box display="flex" flexWrap="nowrap" alignItems="center">
                {isDelegationCompany ? (
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
                )}

                <Box marginLeft={1} marginRight={4}>
                  {isDelegation ? (
                    <>
                      <Text variant="h4">{actorName}</Text>
                      <Text variant="small">{userName}</Text>
                    </>
                  ) : (
                    <Text variant="h4" as="h4">
                      {userName}
                    </Text>
                  )}
                </Box>
              </Box>
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
              <UserDropdownItem
                text={formatMessage(sharedMessages.logout)}
                icon={{ type: 'outline', icon: 'logOut' }}
                onClick={onLogout}
              />
              {/* End of Logout */}
            </Stack>

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
