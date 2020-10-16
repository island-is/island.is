import * as React from 'react' // [1]
import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import { Tag } from '../Tag/Tag'
import { FocusableBox } from '../FocusableBox/FocusableBox'

type ColorScheme = 'blue' | 'red'

export interface TopicCardProps {
  tag?: string
  colorScheme?: ColorScheme
  href: string
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
  href = '/',
  tag,
}) => {
  return (
    <FocusableBox
      alignItems="center"
      background={colorSchemes[colorScheme].backgroundColor}
      borderRadius="large"
      display="flex"
      href={href}
      padding={[2, 2, 3]}
      position="relative"
      width="full"
    >
      <Typography
        variant="h5"
        as="span"
        color={colorSchemes[colorScheme].textColor}
      >
        {children}
      </Typography>
      {tag && (
        <Box paddingLeft={2} marginLeft="auto">
          <Tag
            variant={colorSchemes[colorScheme].tagVariant}
            bordered={colorSchemes[colorScheme].bordered}
            label
          >
            {tag}
          </Tag>
        </Box>
      )}
    </FocusableBox>
  )
}

// [1] Used like this to get Storybook props working. Will be fixed.
