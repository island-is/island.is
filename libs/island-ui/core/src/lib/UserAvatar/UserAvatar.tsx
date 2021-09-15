import React, { MouseEventHandler } from 'react'
import cn from 'classnames'

import { FocusableBox } from '../FocusableBox/FocusableBox'

import * as styles from './UserAvatar.treat'

interface UserAvatarProps {
  username?: string
  onClick?: MouseEventHandler
  size?: keyof typeof styles.avatarSize
  isDelegation?: boolean
  ariaLabel?: string
}

const getInitials = (username?: string) => {
  if (!username) {
    return ''
  }

  const names = username.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }

  return initials
}

export const UserAvatar = ({
  username,
  onClick,
  isDelegation,
  size = 'default',
  ariaLabel,
}: UserAvatarProps) => (
  <FocusableBox
    component={onClick ? 'button' : 'div'}
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexShrink={0}
    flexGrow={0}
    background={isDelegation ? 'blue400' : 'blue100'}
    borderRadius="circle"
    className={styles.avatarSize[size]}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <p
      className={cn(
        styles.initials,
        isDelegation && styles.initialsDelegation,
        styles.initialsSize[size],
      )}
      aria-hidden
    >
      {getInitials(username)}
    </p>
  </FocusableBox>
)
