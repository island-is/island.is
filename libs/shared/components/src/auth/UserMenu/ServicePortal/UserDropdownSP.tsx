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
  Button,
} from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'
import { sharedMessages, userMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import * as styles from '../UserMenu.css'
import { UserDelegations } from './UserDelegationsSP'
import cn from 'classnames'
import { ServicePortalPath, m } from '@island.is/service-portal/core'
import { UserDropdownItem } from './UserDropdownItemSP'
import { UserProfileInfo } from '../UserProfileInfo'
import { UserTopicCard } from './UserTopicCardSP'

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
  const { formatMessage } = useLocale()

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
            className={styles.fullScreen}
          >
            <Stack space={3}>
              <Box
                display="flex"
                flexWrap="nowrap"
                alignItems="center"
                marginBottom={1}
              >
                <UserAvatar username={username} />

                <Box marginLeft={1} marginRight={4}>
                  <Text variant="h4" as="h4">
                    {username}
                  </Text>
                </Box>
              </Box>
              <Divider />
              {isDelegation && (
                <Box>
                  <UserTopicCard
                    colorScheme="blue"
                    icon={{
                      type: 'outline',
                      icon: 'arrowBack',
                      color: 'blue400',
                    }}
                    onClick={() => onSwitchUser(user.profile.actor!.nationalId)}
                  >
                    {formatMessage(userMessages.backToMyself)}
                  </UserTopicCard>
                </Box>
              )}
              <UserDelegations user={user} onSwitchUser={onSwitchUser} />
              {!isDelegation && (
                <Box>
                  <UserProfileInfo /> <Divider />
                </Box>
              )}
              <Box>
                <Box marginBottom={1}>
                  <Text variant="small">{formatMessage(m.settings)}</Text>
                </Box>

                <Box>
                  <UserDropdownItem
                    text={formatMessage(m.personalInformation)}
                    link={ServicePortalPath.SettingsPersonalInformation}
                    icon={{ type: 'outline', icon: 'person' }}
                    onClick={() => onClose()}
                  />
                </Box>
                <Box paddingTop={1}>
                  <UserDropdownItem
                    text={formatMessage(m.accessControl)}
                    link={ServicePortalPath.SettingsAccessControl}
                    icon={{ type: 'outline', icon: 'people' }}
                    onClick={() => onClose()}
                  />
                </Box>
              </Box>

              <Divider />
              <Box paddingTop={1}>
                <UserDropdownItem
                  text={formatMessage(sharedMessages.logout)}
                  icon={{ type: 'outline', icon: 'logOut' }}
                  onClick={onLogout}
                />
              </Box>
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
