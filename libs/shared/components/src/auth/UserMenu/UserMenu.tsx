import React, { useEffect, useState } from 'react'
import { Box, Hidden } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { UserButton } from './UserButton'
import { UserDropdown } from './UserDropdown'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'

type UserMenuProps = {
  fullscreen?: boolean
  small?: boolean
  showDropdownLanguage?: boolean
  setUserMenuOpen?(state: boolean): void
  userMenuOpen?: boolean
  iconOnlyMobile?: boolean
  showLanguageSwitcher?: boolean
  showActorButton?: boolean
}

export const UserMenu = ({
  fullscreen = false,
  showDropdownLanguage = false,
  userMenuOpen,
  small = false,
  setUserMenuOpen,
  showLanguageSwitcher = true,
  showActorButton = true,
  iconOnlyMobile = false,
}: UserMenuProps) => {
  const [dropdownState, setDropdownState] = useState<'closed' | 'open'>(
    'closed',
  )
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

  return (
    <Box display="flex" position="relative" height="full">
      {showLanguageSwitcher && (
        <Hidden below="md">
          <UserLanguageSwitcher user={user} />
        </Hidden>
      )}
      <UserButton
        user={user}
        onClick={handleClick}
        small={small}
        iconOnlyMobile={iconOnlyMobile}
        userMenuOpen={userMenuOpen}
      />

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
        showActorButton={showActorButton}
      />
    </Box>
  )
}
