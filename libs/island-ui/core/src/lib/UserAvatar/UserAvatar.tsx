import React, { MouseEventHandler } from 'react'
import cn from 'classnames'

import { FocusableBox } from '../FocusableBox/FocusableBox'

import * as styles from './UserAvatar.css'

interface UserAvatarProps {
  username?: string
  onClick?: MouseEventHandler
  size?: keyof typeof styles.avatarSize
  isDelegation?: boolean
  ariaLabel?: string
  color?: 'purple' | 'blue'
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
  color = 'blue',
}: UserAvatarProps) => (
  <FocusableBox
    component={onClick ? 'button' : 'div'}
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexShrink={0}
    flexGrow={0}
    background={
      isDelegation
        ? color === 'blue'
          ? 'blue400'
          : 'purple400'
        : color === 'blue'
        ? 'blue100'
        : 'purple100'
    }
    borderRadius="circle"
    className={[styles.avatarSize[size], styles.avatarColor[color]]}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <p
      className={cn(
        styles.initials,
        isDelegation && styles.initialsDelegation,
        styles.initialsSize[size],
        styles.avatarColor[color],
      )}
      aria-hidden
    >
      {getInitials(username)}
    </p>
  </FocusableBox>
)
