import React, { MouseEventHandler } from 'react'
import { RequireAtLeastOne } from 'type-fest'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Tag } from '../Tag/Tag'
import { FocusableBox } from '../FocusableBox/FocusableBox'

type ColorScheme = 'blue' | 'red'

interface TopicCardPropsBase {
  tag?: string
  colorScheme?: ColorScheme
  href?: string
  onClick?: MouseEventHandler
}

export type TopicCardProps = RequireAtLeastOne<
  TopicCardPropsBase,
  'href' | 'onClick'
>

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
  onClick,
}) => {
  return (
    <FocusableBox
      alignItems="center"
      background={colorSchemes[colorScheme].backgroundColor}
      borderRadius="large"
      display="flex"
      href={href}
      onClick={onClick}
      padding={[2, 2, 3]}
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
