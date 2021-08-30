import React, { MouseEventHandler } from 'react'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Tag } from '../Tag/Tag'
import { FocusableBox } from '../FocusableBox/FocusableBox'

type ColorScheme = 'blue' | 'red'

export type TopicCardSize = 'default' | 'small'

interface TopicCardProps {
  tag?: string
  colorScheme?: ColorScheme
  href?: string
  size?: TopicCardSize
  onClick?: MouseEventHandler
}

const colorSchemes = {
  blue: {
    backgroundColor: 'blue100',
    textColor: 'blue400',
    tagVariant: 'darkerBlue',
    bordered: false,
  },
  red: {
    backgroundColor: 'red100',
    textColor: 'red600',
    tagVariant: 'red',
    bordered: true,
  },
} as const

export const TopicCard: React.FC<TopicCardProps> = ({
  children,
  colorScheme = 'blue',
  href,
  tag,
  size = 'default',
  onClick,
}) => {
  return (
    <FocusableBox
      alignItems="center"
      background={colorSchemes[colorScheme].backgroundColor}
      borderRadius="large"
      display="flex"
      component={href || onClick ? undefined : 'span'}
      href={href}
      onClick={onClick}
      padding={size === 'default' ? [2, 2, 3] : [2, 2, 2]}
      position="relative"
      width="full"
    >
      <Text variant="h5" as="span" color={colorSchemes[colorScheme].textColor}>
        {children}
      </Text>
      {tag && (
        <Box component="span" paddingLeft={2} marginLeft="auto">
          <Tag
            variant={colorSchemes[colorScheme].tagVariant}
            outlined={colorSchemes[colorScheme].bordered}
            disabled
          >
            {tag}
          </Tag>
        </Box>
      )}
    </FocusableBox>
  )
}
