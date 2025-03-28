import React, { ReactNode, useEffect, useState } from 'react'

import { Box } from '../../Box/Box'
import { Button } from '../../Button/Button'
import { Hidden } from '../../Hidden/Hidden'

import { UserDropdown } from '../UserDropdown/UserDropdown'
import { UserAvatar } from '../../UserAvatar/UserAvatar'

interface UserMenuProps {
  authenticated?: boolean
  username?: string
  language?: string
  isOpen?: boolean
  dropdownItems?: ReactNode
  switchLanguage?: () => void
  onLogout?: () => void
  onClick?: () => void
}

export const UserMenu = ({
  authenticated,
  username,
  language,
  isOpen,
  dropdownItems,
  switchLanguage,
  onLogout,
  onClick,
}: UserMenuProps) => {
  const [dropdownState, setDropdownState] = useState<'closed' | 'open'>(
    'closed',
  )

  const handleClick = () => {
    if (onClick) {
      onClick()
    }

    setDropdownState(dropdownState === 'open' ? 'closed' : 'open')
  }

  useEffect(() => {
    if (isOpen === false) {
      setDropdownState('closed')
    }
  }, [isOpen])

  if (!authenticated) {
    return null
  }

  return (
    <Box display="flex" alignItems="center" position="relative" height="full">
      <Button variant="utility" onClick={handleClick} icon="chevronDown">
        <Hidden above="xs">
          <UserAvatar username={username} size="small" />
        </Hidden>

        <Hidden below="sm">{username}</Hidden>
      </Button>

      {authenticated && (
        <UserDropdown
          username={username}
          dropdownState={dropdownState}
          language={language}
          dropdownItems={dropdownItems}
          setDropdownState={setDropdownState}
          switchLanguage={switchLanguage}
          onLogout={onLogout}
        />
      )}
    </Box>
  )
}
