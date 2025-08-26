import React, { MouseEventHandler } from 'react'
import {
  Box,
  FocusableBox,
  Icon,
  IconProps,
  Link,
  UserAvatar,
} from '@island.is/island-ui/core'
import * as styles from './UserMenu.css'

type ColorScheme = 'blue' | 'purple'

interface UserTopicCardProps {
  colorScheme?: ColorScheme
  href?: string
  onClick?: MouseEventHandler
  icon?: Pick<IconProps, 'icon' | 'type' | 'color'>
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

export const UserTopicCard: React.FC<
  React.PropsWithChildren<UserTopicCardProps>
> = ({ children, colorScheme = 'blue', href, icon, onClick }) => {
  return (
    <FocusableBox
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
      {!icon ? (
        <UserAvatar
          color={colorScheme === 'blue' ? 'darkBlue' : 'darkPurple'}
          size="medium"
          username={children?.toString()}
        />
      ) : (
        <Icon icon={icon.icon} type={icon.type} color={icon.color} />
      )}

      <Box marginLeft={2} className={styles.userDelegationsText}>
        {children}
      </Box>
    </FocusableBox>
  )
}
