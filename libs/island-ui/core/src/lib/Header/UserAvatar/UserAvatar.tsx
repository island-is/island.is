import React from 'react'
import cn from 'classnames'

import { Box } from '../../Box/Box'

import * as styles from './UserAvatar.treat'

interface UserAvatarProps {
  username?: string
  resize?: boolean
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

export const UserAvatar = ({ username, resize = false }: UserAvatarProps) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    background="blue100"
    borderRadius="circle"
    marginRight={resize ? 0 : 2}
    className={cn(styles.avatar, {
      [styles.avatarResize]: resize,
    })}
  >
    <p
      className={cn(styles.initials, {
        [styles.initialsResize]: resize,
      })}
      color="blue400"
    >
      {getInitials(username)}
    </p>
  </Box>
)
