import React, { Dispatch, SetStateAction } from 'react'

import {
  Box,
  Button,
  Select,
  Stack,
  Text,
  ModalBase,
  UserAvatar,
  Icon,
  GridContainer,
  Option,
} from '@island.is/island-ui/core'
import { Locale, User } from '@island.is/shared/types'
import { sharedMessages, userMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import * as styles from './UserMenu.css'
import { UserDelegations } from './UserDelegations'
import { UserProfileInfo } from './UserProfileInfo'
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
  const handleLanguageChange = (option: ValueType<Option>) =>
    changeLanguage((option as Option).value.toString() as Locale)
  const isVisible = dropdownState === 'open'
  const onClose = () => {
    setDropdownState('closed')
  }

  const isDelegation = Boolean(user.profile.actor)
  const username = user.profile.actor
    ? user.profile.actor.name
    : user.profile.name

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
            className={styles.dropdown}
          >
            <Stack space={2}>
              <Box display="flex" flexWrap="nowrap" alignItems="center">
                <UserAvatar username={username} />

                <Box marginLeft={1} marginRight={4}>
                  <Text variant="h4" as="h4">
                    {username}
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
                label={formatMessage(sharedMessages.language)}
                options={[
                  { label: 'Íslenska', value: 'is' },
                  { label: 'English', value: 'en' },
                ]}
              />

              {isDelegation && (
                <Box>
                  <Button
                    variant="ghost"
                    onClick={() => onSwitchUser(user.profile.actor!.nationalId)}
                    fluid
                  >
                    {formatMessage(userMessages.backToMyself)}
                  </Button>
                </Box>
              )}
              <UserProfileInfo onClose={onClose} />
              <Box>
                <Button
                  onClick={onLogout}
                  fluid
                  icon="logOut"
                  iconType="outline"
                >
                  {formatMessage(sharedMessages.logout)}
                </Button>
              </Box>
            </Stack>

            <UserDelegations user={user} onSwitchUser={onSwitchUser} />

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
