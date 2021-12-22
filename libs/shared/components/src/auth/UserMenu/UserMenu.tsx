import React, { useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { UserButton } from './UserButton'
import { UserDropdown } from './UserDropdown'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'

export const UserMenu = ({
  showLanguageButton = false,
  fullscreen = false,
}: {
  showLanguageButton?: boolean
  fullscreen?: boolean
}) => {
  const [dropdownState, setDropdownState] = useState<'closed' | 'open'>(
    'closed',
  )
  const { signOut, switchUser, userInfo: user } = useAuth()

  const handleClick = () => {
    setDropdownState(dropdownState === 'open' ? 'closed' : 'open')
  }

  if (!user) {
    return null
  }

  return (
    <Box display="flex" position="relative" height="full">
      {showLanguageButton && <UserLanguageSwitcher user={user} />}
      <UserButton user={user} onClick={handleClick} />
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
      />
    </Box>
  )
}
