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
  color?: 'purple' | 'blue' | 'darkBlue' | 'darkPurple' | 'white'
  dataTestid?: string
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
  dataTestid,
}: UserAvatarProps) => (
  <FocusableBox
    component={onClick ? 'button' : 'div'}
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexShrink={0}
    flexGrow={0}
    borderRadius="full"
    className={[
      styles.avatarSize[size],
      styles.avatarColor[isDelegation ? 'isDelegation' : color],
    ]}
    onClick={onClick}
    aria-label={ariaLabel}
    data-testid={dataTestid}
  >
    <p
      className={cn(
        styles.initials,
        styles.initialsSize[size],
        styles.avatarColor[isDelegation ? 'isDelegation' : color],
      )}
      aria-hidden
    >
      {getInitials(username)}
    </p>
  </FocusableBox>
)
