import React, { useEffect, useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { UserButton } from './UserButton'
import { UserDropdown } from './UserDropdown'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'

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
      {/* <UserLanguageSwitcher user={user} /> */}
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
