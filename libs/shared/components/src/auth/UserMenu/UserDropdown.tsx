import {
  Box,
  Divider,
  GridContainer,
  Hidden,
  Icon,
  ModalBase,
  Text,
  UserAvatar,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { sharedMessages, userMessages } from '@island.is/shared/translations'
import { AuthDelegationType } from '@island.is/shared/types'
import { checkDelegation } from '@island.is/shared/utils'
import cn from 'classnames'
import { Dispatch, SetStateAction } from 'react'
import { useWindowSize } from 'react-use'
import { UserDelegations } from './UserDelegations'
import { UserDropdownItem } from './UserDropdownItem'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'
import * as styles from './UserMenu.css'
import { UserProfileInfo } from './UserProfileInfo'

interface UserDropdownProps {
  dropdownState: 'open' | 'closed'
  setDropdownState: Dispatch<SetStateAction<'closed' | 'open'>>
  onLogout?: () => void
  onSwitchUser: (nationalId: string) => void
  fullscreen: boolean
  showActorButton: boolean
  showDropdownLanguage: boolean
}

export const UserDropdown = ({
  dropdownState,
  setDropdownState,
  onSwitchUser,
  onLogout,
  fullscreen,
  showActorButton,
  showDropdownLanguage,
}: UserDropdownProps) => {
  const user = useUserInfo()
  const { formatMessage } = useLocale()
  const isVisible = dropdownState === 'open'
  const onClose = () => {
    setDropdownState('closed')
  }

  const actor = user.profile.actor
  const isDelegation = checkDelegation(user)
  const userName = user.profile.name
  const actorName = actor?.name
  const isDelegationCompany = user.profile.subjectType === 'legalEntity'
  const isProcurationHolder = user.profile.delegationType?.includes(
    AuthDelegationType.ProcurationHolder,
  )

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

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
          <Box
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
            paddingBottom={3}
            paddingTop={2}
          >
            {isDelegationCompany ? (
              <Box
                borderRadius="full"
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
              <Text translate="no" variant="h4" as="h4">
                {userName}
              </Text>
              {isDelegation && (
                <Text translate="no" variant="small">
                  {actorName}
                </Text>
              )}
            </Box>
          </Box>
          {showDropdownLanguage && (
            <Hidden above="sm">{<UserLanguageSwitcher dropdown />}</Hidden>
          )}

          <Divider />

          <Box paddingTop={2}>
            <UserDelegations
              onSwitchUser={onSwitchUser}
              showActorButton={showActorButton}
            />
          </Box>

          {(!isDelegation || isProcurationHolder) && (
            <Box paddingTop={1}>
              <UserProfileInfo onClick={() => onClose()} />
            </Box>
          )}
          <Box paddingTop={1}>
            <UserDropdownItem
              text={formatMessage(sharedMessages.logout)}
              icon={{ type: 'outline', icon: 'logOut' }}
              onClick={onLogout}
            />
          </Box>
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
      modalLabel={formatMessage(userMessages.userButtonAriaModalLabel)}
      removeOnClose={true}
      preventBodyScroll={false}
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
