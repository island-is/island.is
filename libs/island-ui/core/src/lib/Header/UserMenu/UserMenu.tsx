import React, { ReactNode, useState } from 'react'

import { Box } from '../../Box/Box'
import { Button } from '../../Button/Button'
import { Hidden } from '../../Hidden/Hidden'
import { UserAvatar } from '../../UserAvatar/UserAvatar'
import { UserDropdown } from '../UserDropdown/UserDropdown'

interface UserMenuProps {
  authenticated?: boolean
  username?: string
  language?: string
  dropdownItems?: ReactNode
  switchLanguage?: () => void
  onLogout?: () => void
}

export const UserMenu = ({
  authenticated,
  username,
  language,
  dropdownItems,
  switchLanguage,
  onLogout,
}: UserMenuProps) => {
  const [dropdownState, setDropdownState] = useState<'closed' | 'open'>(
    'closed',
  )

  const handleClick = () => {
    setDropdownState(dropdownState === 'open' ? 'closed' : 'open')
  }

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
