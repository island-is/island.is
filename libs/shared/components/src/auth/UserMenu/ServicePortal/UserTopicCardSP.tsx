import React, { MouseEventHandler } from 'react'
import {
  Box,
  Text,
  Link,
  FocusableBox,
  UserAvatar,
} from '@island.is/island-ui/core'

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
    textColor: 'dark400',
    initialsColor: 'blue400',
  },
  purple: {
    backgroundColor: 'purple100',
    circleColor: 'purple200',
    textColor: 'dark400',
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
    <FocusableBox
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
    >
      <UserAvatar
        isUserMenu
        color={colorScheme === 'blue' ? 'default' : 'purple'}
        size="medium"
        username={children?.toString()}
      />
      <Box marginLeft={2}>
        <Text
          lineHeight="xl"
          fontWeight="semiBold"
          variant="sidebar"
          as="span"
          color={colorSchemes[colorScheme].textColor}
        >
          {children}
        </Text>
      </Box>
    </FocusableBox>
  )
}
