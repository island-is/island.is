import React, { useEffect, useState } from 'react'
import { Box, Hidden, SkeletonLoader } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { UserButton } from './UserButton'
import { UserDropdown } from './UserDropdown'
import { UserLanguageSwitcher } from './UserLanguageSwitcher'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

const NationalRegistryUserQuery = gql`
  query NationalRegistryUserProfileQuery {
    nationalRegistryUser {
      fullName
      nationalId
      gender
    }
  }
`

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
  const { data, loading, error } = useQuery<Query>(NationalRegistryUserQuery)
  const { nationalRegistryUser } = data || {}
  useEffect(() => {
    setUserMenuOpen && setUserMenuOpen(dropdownState === 'open')
  }, [dropdownState])

  useEffect(() => {
    if (dropdownState === 'open' && !userMenuOpen) {
      setDropdownState('closed')
    }
  }, [userMenuOpen])

  if (!user || error) {
    return null
  }

  return (
    <Box display="flex" position="relative" height="full">
      <>
        <Hidden below="md">
          <UserLanguageSwitcher user={user} />
        </Hidden>

        <UserButton
          user={user}
          name={nationalRegistryUser?.fullName}
          onClick={handleClick}
          small={small}
        />
        <UserDropdown
          user={user}
          name={nationalRegistryUser?.fullName}
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
      </>
    </Box>
  )
}
