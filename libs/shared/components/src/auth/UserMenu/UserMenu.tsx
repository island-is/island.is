import React, { useEffect, useState } from 'react'
import { Box, Hidden, Icon } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { UserButton } from './UserButton'
import { UserDropdown } from './UserDropdown'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'
import OneSignal from 'react-onesignal'

import MagicBell, {
  FloatingNotificationInbox,
} from '@magicbell/magicbell-react'

export const Notifications = ({
  userExternalId,
}: {
  userExternalId: string
}) => {
  const theme = {
    icon: { borderColor: '#0061ff', width: '24px' },
    unseenBadge: { backgroundColor: '#DF4759' },
    header: {
      backgroundColor: '#0061ff',
      textColor: '#ffffff',
      borderRadius: '16px',
    },
    footer: {
      backgroundColor: '#0061ff',
      textColor: '#ffffff',
      borderRadius: '16px',
    },
    notification: {
      default: {
        textColor: '#15091F',
        borderRadius: '8px',
        backgroundColor: '#0061ff',
      },
      unseen: {
        backgroundColor: '#0061ff',
        textColor: '#15091F',
        borderRadius: '8px',
      },
      unread: {
        backgroundColor: '#0061ff',
        textColor: '#15091F',
        borderRadius: '8px',
      },
    },
  }
  const magicBellApiKey = 'cdd9891950d1aa151ca687c13469e2043db818ec'
  // TODO - HMAC AUTH NEEDS TO BE IMPLEMENTED BEFORE GOING LIVE
  return (
    <MagicBell
      apiKey={magicBellApiKey}
      userExternalId={userExternalId}
      theme={theme}
    >
      {(props) => <FloatingNotificationInbox height={500} {...props} />}
    </MagicBell>
  )
}

export const UserMenu = ({
  fullscreen = false,
  showDropdownLanguage = false,
  userMenuOpen,
  small = false,
  setUserMenuOpen,
}: {
  fullscreen?: boolean
  small?: boolean
  showDropdownLanguage?: boolean
  setUserMenuOpen?: (state: boolean) => void
  userMenuOpen?: boolean
}) => {
  const [dropdownState, setDropdownState] = useState<'closed' | 'open'>(
    'closed',
  )
  const [initialized, setInitialized] = useState<boolean>(false)
  const { signOut, switchUser, userInfo: user } = useAuth()

  const handleClick = () => {
    setDropdownState(dropdownState === 'open' ? 'closed' : 'open')
  }
  useEffect(() => {
    setUserMenuOpen && setUserMenuOpen(dropdownState === 'open')
  }, [dropdownState])

  useEffect(() => {
    if (dropdownState === 'open' && !userMenuOpen) {
      setDropdownState('closed')
    }
  }, [userMenuOpen])

  if (!user) {
    return null
  }

  useEffect(() => {
    async function initNotification() {
      if (!initialized) {
        await OneSignal.init({
          appId: 'cefc0ead-8d4a-494f-95d2-8d040669b54a',
        }).then(() => {
          setInitialized(true)
        })
        await OneSignal.showSlidedownPrompt().then(() => {
          // do other stuff
          console.log(initialized, initialized)
        })
      }

      await OneSignal.isPushNotificationsEnabled(function (isEnabled) {
        if (isEnabled) {
          console.log('Push notifications are enabled!')
        } else {
          console.log('Push notifications are not enabled yet.')
        }
      })
    }

    initNotification()
  }, [initialized])


  return (
    <Box display="flex" position="relative" height="full">
      <Icon icon="eye" />
      <Notifications userExternalId={user.profile.nationalId}></Notifications>
      <Hidden below="md">
        <UserLanguageSwitcher user={user} />
      </Hidden>
      <UserButton user={user} onClick={handleClick} small={small} />
      <UserDropdown
        user={user}
        dropdownState={dropdownState}
        setDropdownState={setDropdownState}
        onLogout={() => {
          setDropdownState('closed')
          signOut()
        }}
        onSwitchUser={(nationalId: string) => {
          setDropdownState('closed')
          switchUser(nationalId)
        }}
        fullscreen={fullscreen}
        showDropdownLanguage={showDropdownLanguage}
      />
    </Box>
  )
}
