import React, { MouseEventHandler } from 'react'
import { Box, Link, UserAvatar } from '@island.is/island-ui/core'
import * as styles from '../UserMenu.css'

type ColorScheme = 'blue' | 'purple'

interface UserTopicCardProps {
  colorScheme?: ColorScheme
  href?: string
  onClick?: MouseEventHandler
}

const colorSchemes = {
  blue: {
    backgroundColor: 'blue100',
    circleColor: 'blue200',
    initialsColor: 'blue400',
  },
  purple: {
    backgroundColor: 'purple100',
    circleColor: 'purple200',
    initialsColor: 'purple400',
  },
} as const

export const UserTopicCard: React.FC<UserTopicCardProps> = ({
  children,
  colorScheme = 'blue',
  href,
  onClick,
}) => {
  return (
    <Box
      className={styles.userTopicCardBox}
      alignItems="center"
      background={colorSchemes[colorScheme].backgroundColor}
      borderRadius="standard"
      display="flex"
      component={href ? Link : onClick ? 'button' : 'span'}
      href={href}
      onClick={onClick}
      padding={[2, 2, 2]}
      position="relative"
      width="full"
      height={'touchable'}
      cursor={'pointer'}
    >
      <UserAvatar
        isUserMenu
        color={colorScheme === 'blue' ? 'default' : 'purple'}
        size="medium"
        username={children?.toString()}
      />
      <Box marginLeft={2} className={styles.userDelegationsText}>
        {children}
      </Box>
    </Box>
  )
}
