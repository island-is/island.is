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
import { useFeatureFlag } from '@island.is/react/feature-flags'
import * as kennitala from 'kennitala'
import { ValueType } from 'react-select'
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

  const isDelegation = Boolean(user.profile.actor)

  const [updateUserProfileMutation] = useUpdateUserProfileMutation()
  const handleLanguageChange = async (option: ValueType<Option>) => {
    const locale = (option as Option).value.toString()
    changeLanguage(locale as Locale)

    if (user && !isDelegation) {
      try {
        await updateUserProfileMutation({
          variables: {
            input: {
              locale: locale,
            },
          },
        })
      } catch (e) {
        return null
      }
    }
  }

  const username = user.profile.actor
    ? user.profile.actor.name
    : user.profile.name
  const isDelegationCompany =
    isDelegation && kennitala.isCompany(user.profile.actor!.nationalId)

  const { value: showPersonalInfo } = useFeatureFlag(
    'isServicePortalPersonalInformationModuleEnabled',
    false,
  )
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
              {/* Current User  - Check if in another user role and change*/}
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
                  <UserAvatar
                    username={
                      isDelegation
                        ? user.profile.actor!.name
                        : user.profile.name
                    }
                  />
                )}

                <Box marginLeft={1} marginRight={4}>
                  {isDelegation ? (
                    <>
                      <Text variant="h4">{user.profile.actor!.name}</Text>
                      <Text variant="small">{user.profile.name}</Text>
                    </>
                  ) : (
                    <Text variant="h4" as="h4">
                      {username}
                    </Text>
                  )}
                </Box>
              </Box>
              <Divider />
              {/* End of current User */}

              <UserDelegations user={user} onSwitchUser={onSwitchUser} />
              {!isDelegation && showPersonalInfo && (
                <>
                  <UserProfileInfo onClick={() => onClose()} />

                  <Divider />
                </>
              )}
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
